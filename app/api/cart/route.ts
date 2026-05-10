import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { CartItem } from "@/models/CartItem";

/**
 * POST /api/cart
 * Saves a single cart item to MongoDB (called when user clicks "Add to Cart").
 * Uses sessionId from the request body to identify the guest session.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // ── Validate required fields ─────────────────────────────────────
    const { sessionId, itemId, name, price } = body;
    if (!sessionId || !itemId || !name || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, itemId, name, price" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { error: "price must be a non-negative number" },
        { status: 400 }
      );
    }

    // ── Upsert: if item already exists for this session, increment qty ─
    const existing = await CartItem.findOne({ sessionId, itemId });

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    }

    // ── Create new cart item ──────────────────────────────────────────
    const cartItem = await CartItem.create({
      sessionId,
      itemId,
      itemType: body.itemType || "equipment",
      name,
      price,
      quantity: body.quantity ?? 1,
      rentalDays: body.rentalDays ?? 1,
      image: body.image || "",
      category: body.category || "",
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/cart]", error);
    return NextResponse.json(
      { error: error.message || "Failed to save cart item" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cart?sessionId=xxx
 * Retrieves all cart items for a given session (used to restore cart on reload).
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query param is required" },
        { status: 400 }
      );
    }

    const items = await CartItem.find({ sessionId }).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("[GET /api/cart]", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart?sessionId=xxx
 * Clears all cart items for a session (called after successful checkout).
 */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId query param is required" },
        { status: 400 }
      );
    }

    await CartItem.deleteMany({ sessionId });
    return NextResponse.json({ message: "Cart cleared" });
  } catch (error: any) {
    console.error("[DELETE /api/cart]", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear cart" },
      { status: 500 }
    );
  }
}
