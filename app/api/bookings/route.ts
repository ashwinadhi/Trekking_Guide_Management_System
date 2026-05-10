import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";

/**
 * POST /api/bookings
 * Unified booking endpoint for all booking types:
 *   - bookingType: "guide"     → Tour guide booking
 *   - bookingType: "hotel"     → Hotel booking
 *   - bookingType: "equipment" → Equipment rental checkout
 *   - bookingType: "car"       → Car rental booking
 *   - bookingType: "service"   → Legacy admin-created bookings
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { bookingType, name, email } = body;

    // ── Validate common required fields ─────────────────────────────
    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ── Type-specific validation ─────────────────────────────────────
    switch (bookingType) {
      case "guide":
        if (!body.bookingDetails?.guide || !body.bookingDetails?.startDate) {
          return NextResponse.json(
            { error: "Guide and start date are required for guide bookings" },
            { status: 400 }
          );
        }
        break;

      case "hotel":
        if (
          !body.bookingDetails?.hotelId ||
          !body.bookingDetails?.checkIn ||
          !body.bookingDetails?.checkOut
        ) {
          return NextResponse.json(
            { error: "Hotel ID, check-in, and check-out dates are required" },
            { status: 400 }
          );
        }
        break;

      case "equipment":
        if (!body.cartItems || body.cartItems.length === 0) {
          return NextResponse.json(
            { error: "At least one cart item is required for equipment bookings" },
            { status: 400 }
          );
        }
        break;

      case "car":
        if (
          !body.bookingDetails?.carId ||
          !body.bookingDetails?.pickupDate ||
          !body.bookingDetails?.pickupLocation
        ) {
          return NextResponse.json(
            {
              error:
                "Car ID, pickup date, and pickup location are required for car bookings",
            },
            { status: 400 }
          );
        }
        break;

      case "service":
      default:
        // Legacy: serviceId + date required
        if (!body.serviceId || !body.date) {
          return NextResponse.json(
            { error: "serviceId and date are required for service bookings" },
            { status: 400 }
          );
        }
        break;
    }

    // ── Build and save the booking document ──────────────────────────
    const booking = await Booking.create({
      userId: body.userId || body.sessionId || "",
      bookingType: bookingType || "service",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: body.phone || "",

      // Legacy fields (kept for backward compat with admin dashboard)
      serviceId: body.serviceId || undefined,
      date: body.date || body.bookingDetails?.startDate || "",
      message: body.message || body.bookingDetails?.specialRequests || "",

      // Flexible payload
      bookingDetails: body.bookingDetails || {},

      // Equipment cart items
      cartItems: body.cartItems || [],

      totalPrice: body.totalPrice ?? 0,
      paymentMethod: body.paymentMethod || "",
      status: "pending",
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Admin-only: fetch all bookings with optional type filter.
 * Query: ?type=guide|hotel|equipment|car|service
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Build query — filter by type if provided
    const query = type ? { bookingType: type } : {};

    const bookings = await Booking.find(query)
      .populate("serviceId", "title category")
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("[GET /api/bookings]", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
