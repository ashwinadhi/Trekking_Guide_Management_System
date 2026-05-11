import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEquipment extends Document {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Daily price
    image: { type: String, required: true },
    category: { type: String, required: true, default: 'General' },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    features: [{ type: String }],
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);
