import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Review } from "@/models/Review";

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { description, rating, slug } = body;

    if (!description || !rating || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await Review.create({
      userName: session.user?.name,
      userImage: session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name,
      description,
      rating: Number(rating),
      slug
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
