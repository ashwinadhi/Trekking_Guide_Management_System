import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guide } from "@/models/Guide";

/**
 * GET /api/guides — Fetch all guides (public).
 * Supports ?sort=experience to sort by most experienced.
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");

    let sortQuery: any = { createdAt: -1 };
    if (sort === "experience") {
      sortQuery = { yearsExperience: -1 };
    } else if (sort === "price-low") {
      sortQuery = { price: 1 };
    } else if (sort === "price-high") {
      sortQuery = { price: -1 };
    }

    const guides = await Guide.find({}).sort(sortQuery);
    return NextResponse.json(guides);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch guides" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/guides — Create a new guide (admin only).
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
    if (!body.name || !body.description || body.price == null || body.yearsExperience == null) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, yearsExperience" },
        { status: 400 }
      );
    }

    const guide = await Guide.create({
      name: body.name,
      profileImage: body.profileImage || "",
      description: body.description,
      about: body.about || "",
      services: Array.isArray(body.services) ? body.services : [],
      yearsExperience: Number(body.yearsExperience),
      languages: Array.isArray(body.languages) ? body.languages : [],
      availability: body.availability || "Available",
      price: Number(body.price),
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      reviews: Array.isArray(body.reviews) ? body.reviews : [],
    });

    return NextResponse.json(guide, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create guide" },
      { status: 500 }
    );
  }
}
