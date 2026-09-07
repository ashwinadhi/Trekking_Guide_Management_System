import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { VehicleBooking } from "@/models/VehicleBooking";
import { Vehicle } from "@/models/Vehicle";
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
} from "@/lib/form-validation";
import {
  rentalDaysBetween,
  dateRangeIncludesBlocked,
  isWithinDedupWindow,
} from "@/lib/booking-pricing";
import { queueVehicleBookingConfirmation } from "@/lib/booking-confirmation-email";
import { queueAdminBookingAlert } from "@/lib/site-notifications";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookings = await VehicleBooking.find({}).sort({ createdAt: -1 });
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
      vehicleId,
      startDate,
      endDate,
      customerName,
      customerEmail,
      customerPhone,
      pickupLocation,
      dropOffLocation,
    } = body;

    if (
      !vehicleId ||
      !startDate ||
      !endDate ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !pickupLocation ||
      !dropOffLocation
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

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (vehicle.soldOutDates?.length && dateRangeIncludesBlocked(startDate, endDate, vehicle.soldOutDates)) {
      return NextResponse.json(
        { error: "One or more selected dates are unavailable for this vehicle." },
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
    const recentDuplicate = await VehicleBooking.findOne({
      vehicleId,
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

    const totalPrice = Math.round(vehicle.pricePerDay * days * 100) / 100;

    const booking = await VehicleBooking.create({
      vehicleId,
      vehicleName: vehicle.name,
      customerName: String(customerName).trim(),
      customerEmail: normalizedEmail,
      customerPhone: String(customerPhone).replace(/\D/g, "").slice(0, 10),
      pickupLocation: String(pickupLocation).trim(),
      dropOffLocation: String(dropOffLocation).trim(),
      startDate,
      endDate,
      totalPrice,
      status: "pending",
    });

    queueVehicleBookingConfirmation({
      to: booking.customerEmail,
      customerName: booking.customerName,
      vehicleName: booking.vehicleName,
      pickupLocation: booking.pickupLocation,
      dropOffLocation: booking.dropOffLocation,
      startDate: String(startDate),
      endDate: String(endDate),
      totalPrice: booking.totalPrice,
    });

    queueAdminBookingAlert({
      type: "Vehicle booking",
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      totalPrice: booking.totalPrice,
      summary: [
        { label: "Vehicle", value: booking.vehicleName },
        { label: "Pickup", value: booking.pickupLocation },
        { label: "Drop-off", value: booking.dropOffLocation },
        { label: "Dates", value: `${startDate} → ${endDate}` },
      ],
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
