import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  isSubjectLine,
  isMessageBody,
} from "@/lib/form-validation";

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

    const { name, email, phone, subject, message } = body;
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "name, email, phone, subject, and message are required" },
        { status: 400 }
      );
    }

    if (!isFullNameNoSpecial(String(name))) {
      return NextResponse.json(
        { error: "Full name may only contain letters and spaces" },
        { status: 400 }
      );
    }
    if (!isValidEmail(String(email))) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (!isTenDigitPhone(String(phone))) {
      return NextResponse.json(
        { error: "Phone must be exactly 10 digits" },
        { status: 400 }
      );
    }
    if (!isSubjectLine(String(subject))) {
      return NextResponse.json(
        { error: "Subject contains invalid characters or is too short" },
        { status: 400 }
      );
    }
    if (!isMessageBody(String(message))) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).replace(/\D/g, "").slice(0, 10),
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
