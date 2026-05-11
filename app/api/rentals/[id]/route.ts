import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Rental } from "@/models/Rental";

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

    const rental = await Rental.findByIdAndUpdate(id, { status: body.status }, {
      new: true,
      runValidators: true,
    });

    if (!rental) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update rental" },
      { status: 500 }
    );
  }
}

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
    const rental = await Rental.findByIdAndDelete(id);

    if (!rental) {
      return NextResponse.json({ error: "Rental request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Rental request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete rental" },
      { status: 500 }
    );
  }
}
