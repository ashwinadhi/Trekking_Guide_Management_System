import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import { HotelBooking } from "@/models/HotelBooking";
import { Rental } from "@/models/Rental";
import { VehicleBooking } from "@/models/VehicleBooking";
import { HelicopterBooking } from "@/models/HelicopterBooking";

type Status = "pending" | "confirmed" | "cancelled";

interface BookingRow {
  status: Status;
  createdAt: Date;
  totalPrice?: number;
  type: string;
  label: string;
}

function monthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function buildMonthSeries(rows: BookingRow[], monthsBack = 6) {
  const now = new Date();
  const keys: string[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }

  const byMonth = new Map(keys.map((k) => [k, { confirmed: 0, pending: 0 }]));

  for (const row of rows) {
    const key = monthKey(new Date(row.createdAt));
    if (!byMonth.has(key)) continue;
    const bucket = byMonth.get(key)!;
    if (row.status === "confirmed") bucket.confirmed += 1;
    else if (row.status === "pending") bucket.pending += 1;
  }

  return keys.map((key) => ({
    month: monthLabel(key),
    monthKey: key,
    confirmed: byMonth.get(key)!.confirmed,
    pending: byMonth.get(key)!.pending,
  }));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [guideBookings, hotelBookings, rentals, vehicleBookings, helicopterBookings] = await Promise.all([
      Booking.find().select("status createdAt totalPrice bookingType name email").sort({ createdAt: -1 }).lean(),
      HotelBooking.find().populate("hotelId", "name").select("status createdAt totalPrice guestName guestEmail").sort({ createdAt: -1 }).lean(),
      Rental.find().select("status createdAt totalPrice customerName customerEmail").sort({ createdAt: -1 }).lean(),
      VehicleBooking.find().select("status createdAt totalPrice customerName customerEmail vehicleName").sort({ createdAt: -1 }).lean(),
      HelicopterBooking.find().select("status createdAt totalPrice customerName customerEmail helicopterName").sort({ createdAt: -1 }).lean(),
    ]);

    const allRows: BookingRow[] = [
      ...guideBookings.map((b) => ({
        status: b.status as Status,
        createdAt: b.createdAt as Date,
        totalPrice: b.totalPrice,
        type: String(b.bookingType || "guide"),
        label: String(b.name || "Guide booking"),
      })),
      ...hotelBookings.map((b) => ({
        status: b.status as Status,
        createdAt: b.createdAt as Date,
        totalPrice: b.totalPrice,
        type: "hotel",
        label: String(b.guestName || "Hotel booking"),
      })),
      ...rentals.map((b) => ({
        status: b.status as Status,
        createdAt: b.createdAt as Date,
        totalPrice: b.totalPrice,
        type: "equipment",
        label: String(b.customerName || "Rental"),
      })),
      ...vehicleBookings.map((b) => ({
        status: b.status as Status,
        createdAt: b.createdAt as Date,
        totalPrice: b.totalPrice,
        type: "vehicle",
        label: String(b.customerName || "Vehicle"),
      })),
      ...helicopterBookings.map((b) => ({
        status: b.status as Status,
        createdAt: b.createdAt as Date,
        totalPrice: b.totalPrice,
        type: "helicopter",
        label: String(b.customerName || "Helicopter"),
      })),
    ];

    const counts = {
      total: allRows.length,
      pending: allRows.filter((r) => r.status === "pending").length,
      confirmed: allRows.filter((r) => r.status === "confirmed").length,
      cancelled: allRows.filter((r) => r.status === "cancelled").length,
      guide: guideBookings.length,
      hotel: hotelBookings.length,
      equipment: rentals.length,
      vehicle: vehicleBookings.length,
      helicopter: helicopterBookings.length,
    };

    const revenueConfirmed = allRows
      .filter((r) => r.status === "confirmed")
      .reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);

    const monthlyChart = buildMonthSeries(allRows, 6);

    const recent = allRows
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((r, i) => ({
        id: i,
        label: r.label,
        type: r.type,
        status: r.status,
        totalPrice: r.totalPrice ?? 0,
        createdAt: r.createdAt,
      }));

    return NextResponse.json({
      counts,
      revenueConfirmed: Math.round(revenueConfirmed * 100) / 100,
      monthlyChart,
      recent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
