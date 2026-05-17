import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Booking } from "@/models/Booking";
import { GuideBooking } from "@/models/GuideBooking";
import { VehicleBooking } from "@/models/VehicleBooking";
import { Guide } from "@/models/Guide";
import { Trek } from "@/models/Trek";

/**
 * GET /api/admin/stats — Dashboard analytics data.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all counts in parallel
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      completedGuideBookings,
      totalGuideBookings,
      pendingGuideBookings,
      totalVehicleBookings,
      pendingVehicleBookings,
      activeGuides,
      totalGuides,
      totalTreks,
      allBookings,
      allGuideBookings,
      allVehicleBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      GuideBooking.countDocuments({ status: "completed" }),
      GuideBooking.countDocuments(),
      GuideBooking.countDocuments({ status: "pending" }),
      VehicleBooking.countDocuments(),
      VehicleBooking.countDocuments({ status: "pending" }),
      Guide.countDocuments({ availabilityStatus: "available" }),
      Guide.countDocuments(),
      Trek.countDocuments(),
      Booking.find({}).select("totalPrice status bookingType createdAt").lean(),
      GuideBooking.find({}).select("totalAmount status serviceCategory createdAt guideName").lean(),
      VehicleBooking.find({}).select("totalPrice status createdAt").lean(),
    ]);

    // Calculate revenue
    const bookingRevenue = allBookings
      .filter((b: any) => b.status === "confirmed")
      .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const guideRevenue = allGuideBookings
      .filter((b: any) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0);
    const vehicleRevenue = allVehicleBookings
      .filter((b: any) => b.status === "confirmed")
      .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    const totalRevenue = bookingRevenue + guideRevenue + vehicleRevenue;

    // Monthly booking stats (last 6 months)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const monthName = d.toLocaleString("default", { month: "short" });

      const monthBookings = allBookings.filter((b: any) => {
        const created = new Date(b.createdAt);
        return created >= monthStart && created <= monthEnd;
      });
      const monthGuideBookings = allGuideBookings.filter((b: any) => {
        const created = new Date(b.createdAt);
        return created >= monthStart && created <= monthEnd;
      });
      const monthVehicleBookings = allVehicleBookings.filter((b: any) => {
        const created = new Date(b.createdAt);
        return created >= monthStart && created <= monthEnd;
      });

      const totalMonth = monthBookings.length + monthGuideBookings.length + monthVehicleBookings.length;
      const confirmedMonth = monthBookings.filter((b: any) => b.status === "confirmed").length +
        monthGuideBookings.filter((b: any) => b.status === "confirmed" || b.status === "completed").length +
        monthVehicleBookings.filter((b: any) => b.status === "confirmed").length;
      const pendingMonth = monthBookings.filter((b: any) => b.status === "pending").length +
        monthGuideBookings.filter((b: any) => b.status === "pending").length +
        monthVehicleBookings.filter((b: any) => b.status === "pending").length;
      const cancelledMonth = monthBookings.filter((b: any) => b.status === "cancelled").length +
        monthGuideBookings.filter((b: any) => b.status === "cancelled").length +
        monthVehicleBookings.filter((b: any) => b.status === "cancelled").length;

      const revenueMonth = 
        monthBookings.filter((b: any) => b.status === "confirmed").reduce((s: number, b: any) => s + (b.totalPrice || 0), 0) +
        monthGuideBookings.filter((b: any) => b.status === "confirmed" || b.status === "completed").reduce((s: number, b: any) => s + (b.totalAmount || 0), 0) +
        monthVehicleBookings.filter((b: any) => b.status === "confirmed").reduce((s: number, b: any) => s + (b.totalPrice || 0), 0);

      monthlyStats.push({
        month: monthName,
        total: totalMonth,
        confirmed: confirmedMonth,
        pending: pendingMonth,
        cancelled: cancelledMonth,
        revenue: revenueMonth,
      });
    }

    // Booking type breakdown
    const bookingTypeBreakdown = {
      trek: allBookings.filter((b: any) => b.bookingType === "guide" || b.bookingType === "service").length,
      hotel: allBookings.filter((b: any) => b.bookingType === "hotel").length,
      equipment: allBookings.filter((b: any) => b.bookingType === "equipment").length,
      car: allBookings.filter((b: any) => b.bookingType === "car").length + totalVehicleBookings,
      guide: totalGuideBookings,
    };

    // Most active guide
    const guideFrequency: Record<string, number> = {};
    allGuideBookings.forEach((b: any) => {
      guideFrequency[b.guideName] = (guideFrequency[b.guideName] || 0) + 1;
    });
    const mostActiveGuide = Object.entries(guideFrequency).sort((a, b) => b[1] - a[1])[0];

    // Most booked service category
    const categoryFrequency: Record<string, number> = {};
    allGuideBookings.forEach((b: any) => {
      categoryFrequency[b.serviceCategory] = (categoryFrequency[b.serviceCategory] || 0) + 1;
    });
    allBookings.forEach((b: any) => {
      categoryFrequency[b.bookingType] = (categoryFrequency[b.bookingType] || 0) + 1;
    });
    const mostBookedService = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1])[0];

    // Peak booking month
    const peakMonth = monthlyStats.reduce((max, m) => m.total > max.total ? m : max, monthlyStats[0]);

    // Recent bookings (last 10)
    const recentBookings = [
      ...allBookings.map((b: any) => ({ ...b, source: "booking" })),
      ...allGuideBookings.map((b: any) => ({ ...b, source: "guide_booking", totalPrice: b.totalAmount })),
      ...allVehicleBookings.map((b: any) => ({ ...b, source: "vehicle_booking" })),
    ]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return NextResponse.json({
      kpi: {
        totalBookings: totalBookings + totalGuideBookings + totalVehicleBookings,
        pendingBookings: pendingBookings + pendingGuideBookings + pendingVehicleBookings,
        confirmedBookings: confirmedBookings + completedGuideBookings,
        cancelledBookings,
        totalRevenue,
        activeGuides,
        totalGuides,
        totalTreks,
      },
      monthlyStats,
      bookingTypeBreakdown,
      insights: {
        mostActiveGuide: mostActiveGuide ? { name: mostActiveGuide[0], count: mostActiveGuide[1] } : null,
        mostBookedService: mostBookedService ? { name: mostBookedService[0], count: mostBookedService[1] } : null,
        highestRevenueCategory: Object.entries(bookingTypeBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A",
        peakBookingMonth: peakMonth?.month || "N/A",
      },
      recentBookings,
    });
  } catch (error: any) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
