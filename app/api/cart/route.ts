import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/db";
import { CartItem } from "@/models/CartItem";
import { Equipment } from "@/models/Equipment";

/**
 * POST /api/cart
 * Saves a single cart item to MongoDB (called when user clicks "Add to Cart").
 * Uses sessionId from the request body to identify the guest session.
 * Prices are always taken from the equipment catalog — client values are ignored.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { sessionId, itemId, name } = body;
    if (!sessionId || !itemId || !name) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, itemId, name" },
        { status: 400 }
      );
    }

    const equipment = await Equipment.findById(itemId);
    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
    }

    const price = equipment.price;
    const quantity = Math.max(1, parseInt(String(body.quantity ?? 1), 10) || 1);
    const rentalDays = Math.max(1, parseInt(String(body.rentalDays ?? 1), 10) || 1);

    const existing = await CartItem.findOne({ sessionId, itemId });

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      existing.price = price;
      existing.name = equipment.title;
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    }

    const cartItem = await CartItem.create({
      sessionId,
      itemId,
      itemType: body.itemType || "equipment",
      name: equipment.title,
      price,
      quantity,
      rentalDays,
      image: body.image || equipment.image || "",
      category: body.category || equipment.category || "",
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
