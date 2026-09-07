import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { HotelBooking } from "@/models/HotelBooking";
import {
  queueBookingDecisionEmail,
  shouldNotifyCustomerOnStatusChange,
} from "@/lib/booking-status-email";

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
    const newStatus = body.status;

    const existing = await HotelBooking.findById(id).populate("hotelId", "name");
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = existing.status;
    existing.status = newStatus;
    await existing.save();

    if (
      shouldNotifyCustomerOnStatusChange(previousStatus, newStatus, body.notifyCustomer)
    ) {
      const hotelName =
        existing.hotelId && typeof existing.hotelId === "object" && "name" in existing.hotelId
          ? String((existing.hotelId as { name?: string }).name || "—")
          : "—";

      queueBookingDecisionEmail({
        to: existing.guestEmail,
        customerName: existing.guestName,
        decision: newStatus as "confirmed" | "cancelled",
        module: "hotel",
        rows: [
          { label: "Hotel", value: hotelName },
          { label: "Room", value: existing.roomType },
          { label: "Check-in", value: existing.checkIn },
          { label: "Check-out", value: existing.checkOut },
          { label: "Total", value: `$${Number(existing.totalPrice)}` },
        ],
      });
    }

    return NextResponse.json(existing);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}

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
    const booking = await HotelBooking.findByIdAndDelete(id);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete booking" },
      { status: 500 }
    );
  }
}
