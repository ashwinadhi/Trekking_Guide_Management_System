import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Hotel } from "@/models/Hotel";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get("destination");

    const query = destinationId ? { destinationId } : {};

    const hotels = await Hotel.find(query).populate("destinationId", "title slug").sort({ createdAt: -1 });

    return NextResponse.json(hotels);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch hotels" },
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

    const hotel = await Hotel.create(body);

    return NextResponse.json(hotel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create hotel" },
      { status: 500 }
    );
  }
}
