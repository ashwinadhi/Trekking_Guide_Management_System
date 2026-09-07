import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Guide } from "@/models/Guide";
import { Trek } from "@/models/Trek";
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  isCountryName,
} from "@/lib/form-validation";
import {
  calculateGuideBookingTotal,
  computeGuideBookingEndDate,
  guideBookingOccupiedDates,
  isWithinDedupWindow,
  parseDurationDays,
  rangeConflictsWithBookedDates,
} from "@/lib/booking-pricing";
import { queueUnifiedBookingConfirmation } from "@/lib/booking-confirmation-email";
import { queueAdminBookingAlert } from "@/lib/site-notifications";

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
    let guideSchedule: { endDate: string; durationDays: number } | null = null;

    // ── Validate common required fields ─────────────────────────────
    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!isValidEmail(String(email))) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isFullNameNoSpecial(String(name))) {
      return NextResponse.json(
        { error: "Name may only contain letters and spaces" },
        { status: 400 }
      );
    }

    // ── Type-specific validation ─────────────────────────────────────
    switch (bookingType) {
      case "guide": {
        const { guide: guideId, startDate } = body.bookingDetails || {};
        if (!guideId || !startDate) {
          return NextResponse.json(
            { error: "Guide and start date are required for guide bookings" },
            { status: 400 }
          );
        }

        const guide = await Guide.findById(guideId);
        if (!guide) {
          return NextResponse.json({ error: "Guide not found" }, { status: 404 });
        }

        let durationDays = 1;
        if (body.bookingDetails?.trek) {
          const trek = await Trek.findById(body.bookingDetails.trek);
          if (!trek) {
            return NextResponse.json({ error: "Trek not found" }, { status: 404 });
          }
          durationDays = parseDurationDays(trek.duration);
        } else if (body.bookingDetails?.duration) {
          durationDays = parseDurationDays(body.bookingDetails.duration);
        }

        const endDate = computeGuideBookingEndDate(startDate, durationDays);
        guideSchedule = { endDate, durationDays };

        const phone = body.phone;
        const country = body.bookingDetails?.country;
        if (!phone || !isTenDigitPhone(String(phone))) {
          return NextResponse.json(
            { error: "Phone must be exactly 10 digits" },
            { status: 400 }
          );
        }
        if (!country || !isCountryName(String(country))) {
          return NextResponse.json(
            { error: "Country may only contain letters and spaces" },
            { status: 400 }
          );
        }

        if (rangeConflictsWithBookedDates(guide.bookedDates, startDate, durationDays)) {
          return NextResponse.json(
            {
              error:
                "This guide is not available for the full trek duration on the selected dates.",
            },
            { status: 400 }
          );
        }

        // Check admin-set unavailability across the full trek window
        if (guide.availabilityStatus !== "available" && guide.unavailableFrom && guide.unavailableTo) {
          const bookingStart = new Date(startDate);
          const bookingEnd = new Date(endDate);
          const unavailableFrom = new Date(guide.unavailableFrom);
          const unavailableTo = new Date(guide.unavailableTo);
          const overlaps = bookingStart <= unavailableTo && bookingEnd >= unavailableFrom;

          if (overlaps) {
            return NextResponse.json(
              { error: "This guide is unavailable during the selected trek dates." },
              { status: 400 }
            );
          }
        } else if (guide.availabilityStatus === "busy") {
          return NextResponse.json(
            { error: "This guide is currently unavailable." },
            { status: 400 }
          );
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const recentDuplicate = await Booking.findOne({
          bookingType: "guide",
          email: normalizedEmail,
          "bookingDetails.guide": guideId,
          "bookingDetails.startDate": startDate,
          status: { $ne: "cancelled" },
        }).sort({ createdAt: -1 });

        if (recentDuplicate && isWithinDedupWindow(recentDuplicate.createdAt)) {
          return NextResponse.json(
            { error: "A similar booking was just submitted. Please wait before trying again." },
            { status: 409 }
          );
        }
        break;
      }

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

    // ── Server-side price calculation (guide bookings) ───────────────
    let totalPrice = Number(body.totalPrice ?? 0);
    if (bookingType === "guide") {
      const guideId = body.bookingDetails?.guide;
      const guide = await Guide.findById(guideId);
      if (!guide) {
        return NextResponse.json({ error: "Guide not found" }, { status: 404 });
      }

      let trekPrice: number | undefined;
      let durationDays = parseDurationDays(body.bookingDetails?.duration);

      if (body.bookingDetails?.trek) {
        const trek = await Trek.findById(body.bookingDetails.trek);
        if (!trek) {
          return NextResponse.json({ error: "Trek not found" }, { status: 404 });
        }
        trekPrice = trek.price;
        durationDays = parseDurationDays(trek.duration);
      }

      totalPrice = calculateGuideBookingTotal({
        guideDailyRate: guide.price,
        trekPrice,
        groupSize: body.bookingDetails?.groupSize,
        durationDays,
      });
    }

    // ── Build and save the booking document ──────────────────────────
    const bookingDetails =
      bookingType === "guide" && guideSchedule
        ? {
            ...body.bookingDetails,
            endDate: guideSchedule.endDate,
            duration: guideSchedule.durationDays,
          }
        : body.bookingDetails || {};

    const booking = await Booking.create({
      userId: body.userId || body.sessionId || "",
      bookingType: bookingType || "service",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: body.phone ? String(body.phone).replace(/\D/g, "").slice(0, 10) : "",

      // Legacy fields (kept for backward compat with admin dashboard)
      serviceId: body.serviceId || undefined,
      date: body.date || body.bookingDetails?.startDate || "",
      message: body.message || body.bookingDetails?.specialRequests || "",

      // Flexible payload
      bookingDetails,

      // Equipment cart items
      cartItems: body.cartItems || [],

      totalPrice,
      paymentMethod: body.paymentMethod || "",
      status: "pending",
    });

    if (bookingType === "guide" && body.bookingDetails?.guide && guideSchedule) {
      const guide = await Guide.findById(body.bookingDetails.guide);
      if (guide) {
        const occupiedDates = guideBookingOccupiedDates(
          body.bookingDetails.startDate,
          guideSchedule.durationDays
        );
        const existing = new Set(guide.bookedDates || []);
        occupiedDates.forEach((d) => existing.add(d));
        guide.bookedDates = Array.from(existing).sort();
        await guide.save();
      }
    }

    queueUnifiedBookingConfirmation({
      email: String(booking.email),
      name: String(booking.name),
      bookingType: String(booking.bookingType || "service"),
      totalPrice: booking.totalPrice,
      bookingDetails: (booking.bookingDetails || {}) as Record<string, unknown>,
      cartItems: (booking.cartItems || []) as Array<Record<string, unknown>>,
      message: booking.message,
      date: booking.date,
    });

    if (bookingType === "guide") {
      const bd = body.bookingDetails || {};
      queueAdminBookingAlert({
        type: "Guide booking",
        customerName: booking.name,
        customerEmail: booking.email,
        customerPhone: booking.phone,
        totalPrice: booking.totalPrice,
        summary: [
          { label: "Guide", value: String(bd.guideName || bd.guide || "—") },
          { label: "Start date", value: String(bd.startDate || "—") },
          { label: "End date", value: String(bd.endDate || "—") },
          { label: "Duration", value: bd.duration ? `${bd.duration} days` : "—" },
          { label: "Trek", value: String(bd.trekName || "—") },
          { label: "Group size", value: String(bd.groupSize || "—") },
        ],
      });
    }

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
