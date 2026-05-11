import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Rental } from "@/models/Rental";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const rentals = await Rental.find({}).sort({ createdAt: -1 });
    return NextResponse.json(rentals);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { customerName, customerEmail, customerPhone, startDate, endDate, deliveryLocation, items, specialRequests } = body;

    if (!customerName || !customerEmail || !customerPhone || !startDate || !endDate || !deliveryLocation || !items || !items.length) {
      return NextResponse.json(
        { error: "Missing required fields or empty cart" },
        { status: 400 }
      );
    }

    // Calculate total price based on dates and items
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    let totalPrice = 0;
    const formattedItems = items.map((item: any) => {
      const itemTotal = item.dailyPrice * item.quantity * days;
      totalPrice += itemTotal;
      return {
        equipmentId: item.id || item.equipmentId, // Frontend sends id, backend expects equipmentId
        name: item.name,
        quantity: item.quantity,
        dailyPrice: item.dailyPrice,
      };
    });

    const rental = await Rental.create({
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      deliveryLocation,
      items: formattedItems,
      totalPrice,
      specialRequests,
      status: "pending",
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create rental request" },
      { status: 500 }
    );
  }
}
