import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guide } from "@/models/Guide";

/**
 * GET /api/guides/[id] — Fetch a single guide by ID (public).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const guide = await Guide.findById(id);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch guide" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/guides/[id] — Update a guide (admin only).
 * Supports partial updates (e.g., just availability).
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

    // Ensure numeric fields stay numeric
    if (body.price != null) body.price = Number(body.price);
    if (body.yearsExperience != null) body.yearsExperience = Number(body.yearsExperience);

    // Parse dates if provided
    if (body.unavailableFrom) body.unavailableFrom = new Date(body.unavailableFrom);
    if (body.unavailableTo) body.unavailableTo = new Date(body.unavailableTo);

    const guide = await Guide.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json(guide);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update guide" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/guides/[id] — Delete a guide (admin only).
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
    const guide = await Guide.findByIdAndDelete(id);

    if (!guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Guide deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete guide" },
      { status: 500 }
    );
  }
}
