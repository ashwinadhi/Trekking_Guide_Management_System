import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import {
  queueBookingDecisionEmail,
  shouldNotifyCustomerOnStatusChange,
} from "@/lib/booking-status-email";
import type { BookingEmailModule } from "@/lib/booking-confirmation-email";
import { releaseGuideBookingDates } from "@/lib/guide-booking-dates";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const newStatus = body.status;

    const existing = await Booking.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = existing.status;
    existing.status = newStatus;
    await existing.save();

    if (
      shouldNotifyCustomerOnStatusChange(previousStatus, newStatus, body.notifyCustomer)
    ) {
      const bd = (existing.bookingDetails || {}) as Record<string, unknown>;
      const trekName = bd.trekName ? String(bd.trekName) : "";
      const bookingType = existing.bookingType;

      let module: BookingEmailModule = "other";
      const rows: { label: string; value: string }[] = [];

      if (bookingType === "guide") {
        module = trekName ? "trek_package" : "guide";
        rows.push(
          { label: "Guide", value: String(bd.guideName || "—") },
          { label: "Trek package", value: trekName || "Not specified" },
          { label: "Start date", value: String(bd.startDate || "—") },
          { label: "End date", value: String(bd.endDate || "—") },
          { label: "Group size", value: String(bd.groupSize || "—") },
          { label: "Total", value: `$${Number(existing.totalPrice ?? 0)}` }
        );
      } else if (bookingType === "equipment") {
        module = "equipment";
        const items = existing.cartItems || [];
        const itemLines =
          items.length > 0
            ? items.map((i) => `${i.quantity}× ${i.name}`).join(" · ")
            : "—";
        rows.push(
          { label: "Rental items", value: itemLines },
          { label: "Total", value: `$${Number(existing.totalPrice ?? 0)}` }
        );
      } else {
        rows.push(
          { label: "Date", value: String(existing.date || bd.startDate || "—") },
          { label: "Total", value: `$${Number(existing.totalPrice ?? 0)}` }
        );
      }

      queueBookingDecisionEmail({
        to: existing.email,
        customerName: existing.name,
        decision: newStatus as "confirmed" | "cancelled",
        module,
        rows,
      });
    }

    if (
      existing.bookingType === "guide" &&
      newStatus === "cancelled" &&
      previousStatus === "pending"
    ) {
      await releaseGuideBookingDates(existing.bookingDetails as Record<string, unknown>);
    }

    return NextResponse.json(existing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 500 });
  }
}
