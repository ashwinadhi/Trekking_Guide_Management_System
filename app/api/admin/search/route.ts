import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import { GuideBooking } from "@/models/GuideBooking";
import { VehicleBooking } from "@/models/VehicleBooking";
import { Guide } from "@/models/Guide";
import { Notification } from "@/models/Notification";

/**
 * GET /api/admin/search — Global search across all admin resources.
 * Query: ?q=searchTerm&scope=all|guides|bookings|notifications
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const scope = searchParams.get("scope") || "all";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], message: "Search term too short" });
    }

    const regex = { $regex: q, $options: "i" };
    const results: any = {};

    if (scope === "all" || scope === "guides") {
      results.guides = await Guide.find({
        $or: [
          { name: regex },
          { description: regex },
          { services: regex },
          { languages: regex },
        ],
      }).limit(10).lean();
    }

    if (scope === "all" || scope === "bookings") {
      results.bookings = await Booking.find({
        $or: [
          { name: regex },
          { email: regex },
          { bookingType: regex },
        ],
      }).limit(10).lean();

      results.guideBookings = await GuideBooking.find({
        $or: [
          { customerName: regex },
          { customerEmail: regex },
          { guideName: regex },
          { bookingId: regex },
        ],
      }).limit(10).lean();

      results.vehicleBookings = await VehicleBooking.find({
        $or: [
          { customerName: regex },
          { customerEmail: regex },
          { vehicleName: regex },
        ],
      }).limit(10).lean();
    }

    if (scope === "all" || scope === "notifications") {
      results.notifications = await Notification.find({
        $or: [
          { title: regex },
          { message: regex },
        ],
      }).limit(10).lean();
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
