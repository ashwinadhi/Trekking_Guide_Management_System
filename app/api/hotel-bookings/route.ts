import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { HotelBooking } from "@/models/HotelBooking";
import { Hotel } from "@/models/Hotel";
import "@/models/Destination";
import { isFullNameNoSpecial, isValidEmail, isTenDigitPhone } from "@/lib/form-validation";
import {
  rentalDaysBetween,
  dateRangeIncludesBlocked,
  isWithinDedupWindow,
} from "@/lib/booking-pricing";
import { queueHotelBookingConfirmation } from "@/lib/booking-confirmation-email";
import { queueAdminBookingAlert } from "@/lib/site-notifications";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { hotelId, roomType, checkIn, checkOut, guestName, guestEmail, guestPhone } = body;

    if (!hotelId || !roomType || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isFullNameNoSpecial(String(guestName))) {
      return NextResponse.json({ error: "Guest name may only contain letters and spaces" }, { status: 400 });
    }
    if (!isValidEmail(String(guestEmail))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!isTenDigitPhone(String(guestPhone))) {
      return NextResponse.json({ error: "Phone must be exactly 10 digits" }, { status: 400 });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Smart Availability Check
    const room = hotel.rooms.find((r: any) => r.type === roomType);
    if (!room) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    if (room.soldOutDates && Array.isArray(room.soldOutDates)) {
      if (dateRangeIncludesBlocked(checkIn, checkOut, room.soldOutDates)) {
        return NextResponse.json(
          { error: "Selected dates include a sold-out date." },
          { status: 400 }
        );
      }
    }

    let nights: number;
    try {
      nights = rentalDaysBetween(checkIn, checkOut);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    // Pending + confirmed bookings both reserve inventory
    const overlappingBookings = await HotelBooking.find({
      hotelId,
      roomType,
      status: { $in: ["pending", "confirmed"] },
      $or: [{ checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }],
    });

    if (overlappingBookings.length >= room.totalRooms) {
      return NextResponse.json(
        { error: `Sorry, all ${roomType} rooms are fully booked for these dates.` },
        { status: 400 }
      );
    }

    const recentDuplicate = await HotelBooking.findOne({
      hotelId,
      guestEmail: String(guestEmail).trim().toLowerCase(),
      checkIn,
      checkOut,
      roomType,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });

    if (recentDuplicate && isWithinDedupWindow(recentDuplicate.createdAt)) {
      return NextResponse.json(
        { error: "A similar booking was just submitted. Please wait before trying again." },
        { status: 409 }
      );
    }

    const calculatedPrice = room.price * nights;

    // Save the booking as pending
    const booking = await HotelBooking.create({
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guestName: String(guestName).trim(),
      guestEmail: String(guestEmail).trim().toLowerCase(),
      guestPhone: String(guestPhone).replace(/\D/g, "").slice(0, 10),
      totalPrice: calculatedPrice,
      status: "pending",
    });

    queueHotelBookingConfirmation({
      to: booking.guestEmail,
      customerName: booking.guestName,
      hotelName: hotel.name,
      roomType: String(roomType),
      checkIn: String(checkIn),
      checkOut: String(checkOut),
      totalPrice: calculatedPrice,
    });

    queueAdminBookingAlert({
      type: "Hotel booking",
      customerName: booking.guestName,
      customerEmail: booking.guestEmail,
      customerPhone: booking.guestPhone,
      totalPrice: calculatedPrice,
      summary: [
        { label: "Hotel", value: hotel.name },
        { label: "Room", value: String(roomType) },
        { label: "Check-in", value: String(checkIn) },
        { label: "Check-out", value: String(checkOut) },
      ],
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create hotel booking" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const bookings = await HotelBooking.find({}).populate("hotelId", "name").sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
