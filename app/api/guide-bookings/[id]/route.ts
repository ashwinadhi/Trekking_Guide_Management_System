import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { GuideBooking } from "@/models/GuideBooking";
import { Notification } from "@/models/Notification";

/**
 * GET /api/guide-bookings/[id] — Get a single guide booking.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const booking = await GuideBooking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/guide-bookings/[id] — Update a guide booking (admin).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const booking = await GuideBooking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Create notification for status changes
    if (body.status) {
      const statusMessages: Record<string, string> = {
        confirmed: `Guide booking ${booking.bookingId} has been confirmed`,
        completed: `Guide booking ${booking.bookingId} has been marked as completed`,
        cancelled: `Guide booking ${booking.bookingId} has been cancelled`,
      };
      if (statusMessages[body.status]) {
        await Notification.create({
          type: body.status === "confirmed" ? "booking_approved" : body.status === "cancelled" ? "booking_cancelled" : "system",
          title: `Booking ${body.status.charAt(0).toUpperCase() + body.status.slice(1)}`,
          message: statusMessages[body.status],
          referenceId: booking._id.toString(),
          referenceType: "guide_booking",
          navigateTo: "/admin/bookings/guide-bookings",
        });
      }
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/guide-bookings/[id] — Delete a guide booking (admin).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const booking = await GuideBooking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
