import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";

/**
 * GET /api/contact
 * Fetch all inquiries (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contact
 * Saves a contact form submission to the inquiries collection.
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "name, email, subject, and message are required" },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { message: "Message saved successfully", id: inquiry._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: error.message || "Failed to save contact message" },
      { status: 500 }
    );
  }
}
