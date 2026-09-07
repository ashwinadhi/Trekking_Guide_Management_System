import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Rental } from "@/models/Rental";
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

    const existing = await Rental.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    const previousStatus = existing.status;
    existing.status = newStatus;
    await existing.save();

    if (
      shouldNotifyCustomerOnStatusChange(previousStatus, newStatus, body.notifyCustomer)
    ) {
      const itemSummary =
        existing.items.length > 0
          ? existing.items.map((i) => `${i.quantity}× ${i.name}`).join(" · ")
          : "—";

      queueBookingDecisionEmail({
        to: existing.customerEmail,
        customerName: existing.customerName,
        decision: newStatus as "confirmed" | "cancelled",
        module: "equipment",
        rows: [
          { label: "Rental period", value: `${existing.startDate} → ${existing.endDate}` },
          { label: "Delivery", value: existing.deliveryLocation },
          { label: "Items", value: itemSummary },
          { label: "Total", value: `$${Number(existing.totalPrice)}` },
        ],
      });
    }

    return NextResponse.json(existing);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update rental" },
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
    const rental = await Rental.findByIdAndDelete(id);

    if (!rental) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Rental request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete rental" },
      { status: 500 }
    );
  }
}
