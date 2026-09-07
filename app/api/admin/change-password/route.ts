import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = (session.user as { id?: string }).id;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email: session.user?.email });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(String(currentPassword), user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    user.password = await bcrypt.hash(String(newPassword), 12);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
