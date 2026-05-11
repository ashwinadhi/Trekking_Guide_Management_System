import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Equipment } from "@/models/Equipment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const equipment = await Equipment.find({}).sort({ createdAt: -1 });
    return NextResponse.json(equipment);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch equipment" },
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

    if (!body.title || !body.price || !body.image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // Add slug to payload
    const payload = { ...body, slug };

    const equipment = await Equipment.create(payload);

    return NextResponse.json(equipment, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An equipment with this title/slug already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create equipment" },
      { status: 500 }
    );
  }
}
