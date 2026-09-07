import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Review } from "@/models/Review";
import { isReviewDescription, isFullNameNoSpecial } from "@/lib/form-validation";
import { queueNewReviewAdminEmail } from "@/lib/site-notifications";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    
    const query = slug && slug !== "all" ? { slug } : {};
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
    const { description, rating, slug, userName } = body;

    if (!description || !rating || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isReviewDescription(String(description))) {
      return NextResponse.json(
        { error: "Review text must be between 20 and 4000 characters" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    let displayName = userName ? String(userName).trim() : "";

    if (session?.user?.name) {
      displayName = session.user.name;
    }

    if (!displayName || !isFullNameNoSpecial(displayName)) {
      return NextResponse.json(
        { error: "Please provide your name using letters and spaces only" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      userName: displayName,
      userImage: session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`,
      description,
      rating: Number(rating),
      slug,
    });

    queueNewReviewAdminEmail({
      userName: displayName,
      rating: Number(rating),
      slug: String(slug),
      description: String(description),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
