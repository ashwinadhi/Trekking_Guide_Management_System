import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { HelicopterBooking } from "@/models/HelicopterBooking";
import { Helicopter } from "@/models/Helicopter";
import { isValidEmail, isTenDigitPhone, isFullNameNoSpecial } from "@/lib/form-validation";
import { rentalDaysBetween, dateRangeIncludesBlocked, isWithinDedupWindow } from "@/lib/booking-pricing";
import { queueHelicopterBookingConfirmation } from "@/lib/booking-confirmation-email";
import { queueAdminBookingAlert } from "@/lib/site-notifications";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookings = await HelicopterBooking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      helicopterId,
      startDate,
      endDate,
      customerName,
      customerEmail,
      customerPhone,
      departureHelipad,
      landingHelipad,
      passengers,
    } = body;

    if (
      !helicopterId ||
      !startDate ||
      !endDate ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !departureHelipad ||
      !landingHelipad
    ) {
      return NextResponse.json({ error: "All booking fields are required" }, { status: 400 });
    }

    if (!isFullNameNoSpecial(String(customerName))) {
      return NextResponse.json({ error: "Name may only contain letters and spaces" }, { status: 400 });
    }
    if (!isValidEmail(String(customerEmail))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!isTenDigitPhone(String(customerPhone))) {
      return NextResponse.json({ error: "Phone must be exactly 10 digits" }, { status: 400 });
    }

    const helicopter = await Helicopter.findById(helicopterId);
    if (!helicopter) {
      return NextResponse.json({ error: "Helicopter not found" }, { status: 404 });
    }

    const passengerCount = Math.max(1, Number(passengers) || 1);
    if (passengerCount > helicopter.capacity) {
      return NextResponse.json(
        { error: `This aircraft seats a maximum of ${helicopter.capacity} passengers.` },
        { status: 400 }
      );
    }

    if (helicopter.soldOutDates?.length && dateRangeIncludesBlocked(startDate, endDate, helicopter.soldOutDates)) {
      return NextResponse.json(
        { error: "One or more selected dates are unavailable for this aircraft." },
        { status: 400 }
      );
    }

    let days: number;
    try {
      days = rentalDaysBetween(startDate, endDate);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const normalizedEmail = String(customerEmail).trim().toLowerCase();
    const recentDuplicate = await HelicopterBooking.findOne({
      helicopterId,
      customerEmail: normalizedEmail,
      startDate,
      endDate,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });

    if (recentDuplicate && isWithinDedupWindow(recentDuplicate.createdAt)) {
      return NextResponse.json(
        { error: "A similar booking was just submitted. Please wait before trying again." },
        { status: 409 }
      );
    }

    const totalPrice = Math.round(helicopter.pricePerFlight * days * 100) / 100;

    const booking = await HelicopterBooking.create({
      helicopterId,
      helicopterName: helicopter.name,
      customerName: String(customerName).trim(),
      customerEmail: normalizedEmail,
      customerPhone: String(customerPhone).replace(/\D/g, "").slice(0, 10),
      departureHelipad: String(departureHelipad).trim(),
      landingHelipad: String(landingHelipad).trim(),
      startDate,
      endDate,
      passengers: passengerCount,
      totalPrice,
      status: "pending",
    });

    queueHelicopterBookingConfirmation({
      to: booking.customerEmail,
      customerName: booking.customerName,
      helicopterName: booking.helicopterName,
      departureHelipad: booking.departureHelipad,
      landingHelipad: booking.landingHelipad,
      startDate: String(startDate),
      endDate: String(endDate),
      passengers: booking.passengers,
      totalPrice: booking.totalPrice,
    });

    queueAdminBookingAlert({
      type: "Helicopter booking",
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      totalPrice: booking.totalPrice,
      summary: [
        { label: "Aircraft", value: booking.helicopterName },
        { label: "Departure", value: booking.departureHelipad },
        { label: "Landing", value: booking.landingHelipad },
        { label: "Passengers", value: String(booking.passengers) },
        { label: "Dates", value: `${startDate} → ${endDate}` },
      ],
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
