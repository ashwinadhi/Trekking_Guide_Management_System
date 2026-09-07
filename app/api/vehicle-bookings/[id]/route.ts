import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { VehicleBooking } from "@/models/VehicleBooking";
import {
  queueBookingDecisionEmail,
  shouldNotifyCustomerOnStatusChange,
} from "@/lib/booking-status-email";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const newStatus = body.status;

    const existing = await VehicleBooking.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = existing.status;
    existing.status = newStatus;
    await existing.save();

    if (
      shouldNotifyCustomerOnStatusChange(previousStatus, newStatus, body.notifyCustomer)
    ) {
      queueBookingDecisionEmail({
        to: existing.customerEmail,
        customerName: existing.customerName,
        decision: newStatus as "confirmed" | "cancelled",
        module: "vehicle",
        rows: [
          { label: "Vehicle", value: existing.vehicleName },
          { label: "Pickup", value: existing.pickupLocation },
          { label: "Drop-off", value: existing.dropOffLocation },
          { label: "Start", value: existing.startDate },
          { label: "End", value: existing.endDate },
          { label: "Total", value: `$${Number(existing.totalPrice)}` },
        ],
      });
    }

    return NextResponse.json(existing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await VehicleBooking.findByIdAndDelete(id);
    return NextResponse.json({ message: "Booking deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
