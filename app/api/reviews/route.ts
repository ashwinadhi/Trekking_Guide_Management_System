import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Review } from "@/models/Review";
import { isReviewDescription } from "@/lib/form-validation";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const moderation = searchParams.get("moderation") === "true";
    
    // Check if the user is an admin
    const session = await getServerSession(authOptions);
    const isAdmin = session && (session.user as any)?.role === "admin";

    // Build the query
    const query: any = {};
    if (slug && slug !== "all") {
      query.slug = slug;
    }
    
    // Only return unapproved reviews if requested by an admin in moderation mode
    if (!isAdmin || !moderation) {
      query.isApproved = true;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userName, description, rating, slug } = body;

    if (!userName || !description || !rating || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isReviewDescription(String(description))) {
      return NextResponse.json(
        { error: "Review text must be between 20 and 4000 characters" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userName: String(userName).trim(),
      userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(String(userName).trim())}&background=random`,
      description,
      rating: Number(rating),
      slug,
      isApproved: false // Always false initially, must be verified by admin
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
