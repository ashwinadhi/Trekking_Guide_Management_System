import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Trek } from "@/models/Trek";

/**
 * GET /api/treks/[id] — Fetch a single trek by ID (public).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    // Ensure Guide model is registered before populate
    require("@/models/Guide");
    const { id } = await params;
    const trek = await Trek.findById(id).populate('guideId');

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json(trek);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch trek" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/treks/[id] — Update a trek (admin only).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const trek = await Trek.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json(trek);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update trek" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/treks/[id] — Delete a trek (admin only).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const trek = await Trek.findByIdAndDelete(id);

    if (!trek) {
      return NextResponse.json({ error: "Trek not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Trek deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete trek" },
      { status: 500 }
    );
  }
}
