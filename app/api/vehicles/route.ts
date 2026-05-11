import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";

export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    return NextResponse.json(vehicles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    
    if (!body.name) {
      return NextResponse.json({ error: "Vehicle name is required" }, { status: 400 });
    }

    // Explicitly cast dates to ensure Mongoose doesn't fail on string format
    if (body.soldOutDates) {
      body.soldOutDates = body.soldOutDates.map((d: string) => new Date(d));
    }

    // Check for slug collision and adjust if necessary
    let slug = body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existing = await Vehicle.findOne({ slug });
    if (existing) {
      body.slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    } else {
      body.slug = slug;
    }

    const vehicle = await Vehicle.create(body);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    console.error("Vehicle POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
