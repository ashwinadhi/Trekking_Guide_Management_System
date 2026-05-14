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
import { queueVehicleBookingConfirmation } from "@/lib/booking-confirmation-email";

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
      pricePerDay,
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
      pricePerDay == null ||
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

    // Calculate total price
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = Number(pricePerDay) * days;

    const booking = await VehicleBooking.create({
      vehicleId,
      vehicleName: String(body.vehicleName || vehicle.name),
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
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

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
