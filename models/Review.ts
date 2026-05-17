import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userName: string;
  userImage: string;
  description: string;
  rating: number;
  slug: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userName: { type: String, required: true },
  userImage: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  slug: { type: String, required: true }, // trek slug or 'general'
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Review;
}

export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
