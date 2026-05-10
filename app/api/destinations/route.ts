import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Destination } from "@/models/Destination";
import { Trek } from "@/models/Trek";

export async function GET() {
  try {
    await connectDB();
    const destinations = await Destination.find({}).sort({ createdAt: -1 }).lean();

    // Dynamically calculate trekCount for each destination based on slug
    const destinationsWithCounts = await Promise.all(
      destinations.map(async (dest) => {
        const count = await Trek.countDocuments({ region: dest.slug });
        return { ...dest, trekCount: count };
      })
    );

    return NextResponse.json(destinationsWithCounts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    let slug = body.slug;
    if (!slug && body.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const destination = await Destination.create({
      title: body.title,
      description: body.description,
      image: body.image || "",
      slug: slug,
      availableGuides: body.availableGuides || 0,
      priceRange: body.priceRange || "",
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error: any) {
    // Check for duplicate slug error (MongoDB code 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A destination with this title or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create destination" },
      { status: 500 }
    );
  }
}
