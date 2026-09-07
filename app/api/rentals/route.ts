import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Rental } from "@/models/Rental";
import { Equipment } from "@/models/Equipment";
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  isAddressText,
  isSpecialRequestsText,
} from "@/lib/form-validation";
import { rentalDaysBetween, isWithinDedupWindow } from "@/lib/booking-pricing";
import { queueRentalEquipmentConfirmation } from "@/lib/booking-confirmation-email";
import { queueAdminBookingAlert } from "@/lib/site-notifications";

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

    if (!isFullNameNoSpecial(String(customerName))) {
      return NextResponse.json({ error: "Name may only contain letters and spaces" }, { status: 400 });
    }
    if (!isValidEmail(String(customerEmail))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!isTenDigitPhone(String(customerPhone))) {
      return NextResponse.json({ error: "Phone must be exactly 10 digits" }, { status: 400 });
    }
    if (!isAddressText(String(deliveryLocation))) {
      return NextResponse.json(
        { error: "Delivery location must be at least 5 characters and use allowed characters only" },
        { status: 400 }
      );
    }
    if (specialRequests == null || !isSpecialRequestsText(String(specialRequests))) {
      return NextResponse.json(
        { error: "Special requests / notes are required (at least 5 characters)" },
        { status: 400 }
      );
    }

    let days: number;
    try {
      days = rentalDaysBetween(startDate, endDate);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const normalizedEmail = String(customerEmail).trim().toLowerCase();
    const recentDuplicate = await Rental.findOne({
      customerEmail: normalizedEmail,
      startDate,
      endDate,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });

    if (recentDuplicate && isWithinDedupWindow(recentDuplicate.createdAt)) {
      return NextResponse.json(
        { error: "A similar rental request was just submitted. Please wait before trying again." },
        { status: 409 }
      );
    }

    let totalPrice = 0;
    const formattedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.name || "item"}: must be a positive whole number` },
          { status: 400 }
        );
      }

      const equipmentId = item.id || item.equipmentId;
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return NextResponse.json(
          { error: `Equipment not found: ${equipmentId}` },
          { status: 404 }
        );
      }

      const dailyPrice = equipment.price;
      const itemTotal = dailyPrice * quantity * days;
      totalPrice += itemTotal;

      formattedItems.push({
        equipmentId: equipment._id,
        name: equipment.title,
        quantity,
        dailyPrice,
      });
    }

    totalPrice = Math.round(totalPrice * 100) / 100;

    const rental = await Rental.create({
      customerName: String(customerName).trim(),
      customerEmail: normalizedEmail,
      customerPhone: String(customerPhone).replace(/\D/g, "").slice(0, 10),
      startDate,
      endDate,
      deliveryLocation: String(deliveryLocation).trim(),
      items: formattedItems,
      totalPrice,
      specialRequests: String(specialRequests).trim(),
      status: "pending",
    });

    const itemSummary =
      formattedItems.length > 0
        ? formattedItems.map((i) => `${i.quantity}× ${i.name}`).join(" · ")
        : "—";
    queueRentalEquipmentConfirmation({
      to: rental.customerEmail,
      customerName: rental.customerName,
      startDate: String(startDate),
      endDate: String(endDate),
      deliveryLocation: rental.deliveryLocation,
      totalPrice: rental.totalPrice,
      itemSummary,
    });

    queueAdminBookingAlert({
      type: "Equipment rental",
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      customerPhone: rental.customerPhone,
      totalPrice: rental.totalPrice,
      summary: [
        { label: "Period", value: `${startDate} → ${endDate}` },
        { label: "Delivery", value: rental.deliveryLocation },
        { label: "Items", value: itemSummary },
      ],
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create rental request" },
      { status: 500 }
    );
  }
}
