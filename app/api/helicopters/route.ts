import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Helicopter } from "@/models/Helicopter";

export async function GET() {
  try {
    await connectDB();
    const helicopters = await Helicopter.find({}).sort({ createdAt: -1 });
    return NextResponse.json(helicopters);
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
      return NextResponse.json({ error: "Helicopter name is required" }, { status: 400 });
    }

    if (body.soldOutDates) {
      body.soldOutDates = body.soldOutDates.map((d: string) => new Date(d));
    }

    let slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const existing = await Helicopter.findOne({ slug });
    if (existing) {
      body.slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    } else {
      body.slug = slug;
    }

    const helicopter = await Helicopter.create(body);
    return NextResponse.json(helicopter, { status: 201 });
  } catch (error: any) {
    console.error("Helicopter POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
