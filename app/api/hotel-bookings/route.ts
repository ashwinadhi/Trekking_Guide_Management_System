import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { HotelBooking } from "@/models/HotelBooking";
import { Hotel } from "@/models/Hotel";
import { isFullNameNoSpecial, isValidEmail, isTenDigitPhone } from "@/lib/form-validation";
import { queueHotelBookingConfirmation } from "@/lib/booking-confirmation-email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { hotelId, roomType, checkIn, checkOut, guestName, guestEmail, guestPhone, totalPrice } = body;

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

    // Basic Sold Out Check (Hardcoded dates)
    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();

    if (room.soldOutDates && Array.isArray(room.soldOutDates)) {
      for (const dateStr of room.soldOutDates) {
        const soldOutTime = new Date(dateStr).getTime();
        if (soldOutTime >= checkInDate && soldOutTime < checkOutDate) {
          return NextResponse.json(
            { error: "Selected dates include a sold-out date." },
            { status: 400 }
          );
        }
      }
    }

    // Check how many bookings overlap with the requested dates for this room type
    const overlappingBookings = await HotelBooking.find({
      hotelId,
      roomType,
      status: 'confirmed', // Only confirmed bookings reduce availability
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    });

    if (overlappingBookings.length >= room.totalRooms) {
      return NextResponse.json(
        { error: `Sorry, all ${roomType} rooms are fully booked for these dates.` },
        { status: 400 }
      );
    }

    // Calculate total price if not passed explicitly
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
    const calculatedPrice = totalPrice || (room.price * nights);

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
