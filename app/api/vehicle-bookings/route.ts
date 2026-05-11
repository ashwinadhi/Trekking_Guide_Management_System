import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { VehicleBooking } from "@/models/VehicleBooking";
import { Vehicle } from "@/models/Vehicle";

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
    const { vehicleId, startDate, endDate, pricePerDay } = body;

    // Calculate total price
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = pricePerDay * days;

    const booking = await VehicleBooking.create({
      ...body,
      totalPrice,
      status: "pending"
    });

    // Update vehicle soldOutDates (Optional: could be manual by admin, but let's automate for reliability)
    // Actually, user said "Multi-Date Picker to block out soldOutDates", suggesting admin control.
    // But we should probably add the booked dates to soldOutDates automatically too.
    
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
