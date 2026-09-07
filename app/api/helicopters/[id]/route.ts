import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Helicopter } from "@/models/Helicopter";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    if (body.soldOutDates) {
      body.soldOutDates = body.soldOutDates.map((d: string) => new Date(d));
    }

    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const helicopter = await Helicopter.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(helicopter);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await Helicopter.findByIdAndDelete(id);
    return NextResponse.json({ message: "Helicopter deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
