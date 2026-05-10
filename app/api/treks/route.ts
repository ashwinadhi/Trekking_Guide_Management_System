import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Trek } from "@/models/Trek";

/**
 * GET /api/treks — Fetch all treks (public).
 */
export async function GET() {
  try {
    await connectDB();
    const treks = await Trek.find({}).sort({ createdAt: -1 });
    return NextResponse.json(treks);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch treks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/treks — Create a new trek (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.description || body.price == null || !body.duration) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, price, duration" },
        { status: 400 }
      );
    }

    const trek = await Trek.create({
      title: body.title,
      description: body.description,
      price: Number(body.price),
      duration: body.duration,
      image: body.image || "",
      highlights: body.highlights || [],
      itinerary: body.itinerary || [],
      trekInfo: body.trekInfo || { difficulty: '', maxElevation: '', accommodation: '', bestSeason: '' },
      gallery: body.gallery || [],
      guideId: body.guideId || null,
    });

    return NextResponse.json(trek, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create trek" },
      { status: 500 }
    );
  }
}
