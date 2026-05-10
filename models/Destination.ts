import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDestination extends Document {
  title: string;
  description: string;
  image: string;
  slug: string;
  availableGuides: number;
  priceRange: string;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema: Schema = new Schema(
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
    image: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    availableGuides: {
      type: Number,
      default: 0,
    },
    priceRange: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Destination: Model<IDestination> =
  mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
