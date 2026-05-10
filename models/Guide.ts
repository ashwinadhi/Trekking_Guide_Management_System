import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Guide model — stores trekking guide profiles managed by admin.
 * Supports arrays for services, languages, gallery, and embedded reviews.
 */

export interface IReview {
  user: string;
  comment: string;
  rating: number;
}

export interface IGuide extends Document {
  name: string;
  profileImage: string;
  description: string;
  about: string;
  services: string[];
  yearsExperience: number;
  languages: string[];
  availability: 'Available' | 'On Trek' | 'Busy';
  price: number;
  gallery: string[];
  reviews: IReview[];
  bookedDates: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  { _id: true }
);

const GuideSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    about: {
      type: String,
      default: '',
    },
    services: {
      type: [String],
      default: [],
    },
    yearsExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative'],
    },
    languages: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ['Available', 'On Trek', 'Busy'],
      default: 'Available',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },
    bookedDates: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Guide: Model<IGuide> =
  mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);
