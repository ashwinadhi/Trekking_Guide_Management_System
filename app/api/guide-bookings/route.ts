import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { GuideBooking } from "@/models/GuideBooking";
import { Guide } from "@/models/Guide";
import { Notification } from "@/models/Notification";

/**
 * Generate a unique booking ID: GB-YYYYMMDD-XXXXX
 */
function generateBookingId(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GB-${datePart}-${randomPart}`;
}

/**
 * POST /api/guide-bookings — Create a new guide booking (public).
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      guideId, serviceCategory, customerName, customerEmail, customerPhone,
      startDate, endDate, groupSize, pickupLocation, specialNotes
    } = body;

    // Validate required fields
    if (!guideId || !serviceCategory || !customerName || !customerEmail || !customerPhone || !startDate || !endDate || !groupSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate guide exists
    const guide = await Guide.findById(guideId);
    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }
    const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Check for overlapping bookings
    const overlapping = await GuideBooking.findOne({
      guideId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "Guide is already booked for the selected dates" },
        { status: 400 }
      );
    }

    // Check guide's unavailability range
    if (guide.unavailableFrom && guide.unavailableTo) {
      const unavailFrom = new Date(guide.unavailableFrom);
      const unavailTo = new Date(guide.unavailableTo);
      if (start <= unavailTo && end >= unavailFrom) {
        return NextResponse.json(
          { error: "Guide is unavailable during the selected dates" },
          { status: 400 }
        );
      }
    }

    const pricePerDay = guide.price;
    const totalAmount = pricePerDay * numberOfDays;
    const bookingId = generateBookingId();

    const booking = await GuideBooking.create({
      bookingId,
      guideId,
      guideName: guide.name,
      serviceCategory,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      startDate: start,
      endDate: end,
      numberOfDays,
      groupSize: Number(groupSize),
      pickupLocation: pickupLocation || "",
      specialNotes: specialNotes || "",
      pricePerDay,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // Create notification
    await Notification.create({
      type: "guide_booking",
      title: "New Guide Booking",
      message: `${customerName} booked ${guide.name} for ${numberOfDays} days (${serviceCategory.replace("_", " ")})`,
      referenceId: booking._id.toString(),
      referenceType: "guide_booking",
      navigateTo: "/admin/bookings/guide-bookings",
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/guide-bookings]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create guide booking" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/guide-bookings — Fetch guide bookings.
 * Query: ?guideId=xxx&status=pending&page=1&limit=10
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const guideId = searchParams.get("guideId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};
    if (guideId) query.guideId = guideId;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { bookingId: { $regex: search, $options: "i" } },
        { guideName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await GuideBooking.countDocuments(query);
    const bookings = await GuideBooking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("[GET /api/guide-bookings]", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch guide bookings" },
      { status: 500 }
    );
  }
}
