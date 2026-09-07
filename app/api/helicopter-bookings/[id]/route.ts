import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { HelicopterBooking } from "@/models/HelicopterBooking";
import { queueBookingDecisionEmail, shouldNotifyCustomerOnStatusChange } from "@/lib/booking-status-email";

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

    const existing = await HelicopterBooking.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = existing.status;
    existing.status = newStatus;
    await existing.save();

    if (shouldNotifyCustomerOnStatusChange(previousStatus, newStatus, body.notifyCustomer)) {
      queueBookingDecisionEmail({
        to: existing.customerEmail,
        customerName: existing.customerName,
        decision: newStatus as "confirmed" | "cancelled",
        module: "helicopter",
        rows: [
          { label: "Aircraft", value: existing.helicopterName },
          { label: "Departure", value: existing.departureHelipad },
          { label: "Landing", value: existing.landingHelipad },
          { label: "Passengers", value: String(existing.passengers) },
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
    await HelicopterBooking.findByIdAndDelete(id);
    return NextResponse.json({ message: "Booking deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
