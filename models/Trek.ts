import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Trek model — stores trekking route data managed by admin.
 * Fields: title, description (markdown/text), price, duration, image (URL).
 */
export interface ITrek extends Document {
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  trekInfo: { difficulty: string; maxElevation: string; accommodation: string; bestSeason: string };
  gallery: string[];
  guideId: mongoose.Types.ObjectId | any;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrekSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    trekInfo: {
      difficulty: { type: String, default: '' },
      maxElevation: { type: String, default: '' },
      accommodation: { type: String, default: '' },
      bestSeason: { type: String, default: '' },
    },
    gallery: {
      type: [String],
      default: [],
    },
    guideId: {
      type: Schema.Types.ObjectId,
      ref: 'Guide',
    },
    region: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Trek: Model<ITrek> =
  mongoose.models.Trek || mongoose.model<ITrek>('Trek', TrekSchema);
