import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import { VehicleBooking } from "@/models/VehicleBooking";
import { HelicopterBooking } from "@/models/HelicopterBooking";
import { Inquiry } from "@/models/Inquiry";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch counts for pending items
    const [
      pendingTrekBookings,
      pendingVehicleBookings,
      pendingHelicopterBookings,
      unreadInquiries
    ] = await Promise.all([
      Booking.find({ status: "pending" }).sort({ createdAt: -1 }).limit(5),
      VehicleBooking.find({ status: "pending" }).sort({ createdAt: -1 }).limit(5),
      HelicopterBooking.find({ status: "pending" }).sort({ createdAt: -1 }).limit(5),
      Inquiry.find({ isRead: false }).sort({ createdAt: -1 }).limit(5)
    ]);

    const totalCount = 
      (await Booking.countDocuments({ status: "pending" })) +
      (await VehicleBooking.countDocuments({ status: "pending" })) +
      (await HelicopterBooking.countDocuments({ status: "pending" })) +
      (await Inquiry.countDocuments({ isRead: false }));

    return NextResponse.json({
      trekBookings: pendingTrekBookings,
      vehicleBookings: pendingVehicleBookings,
      helicopterBookings: pendingHelicopterBookings,
      inquiries: unreadInquiries,
      totalCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
