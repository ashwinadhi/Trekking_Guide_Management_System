import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHelicopter extends Document {
  name: string;
  type: "Sightseeing" | "Heli-Trek" | "Charter" | "Rescue";
  image: string;
  description: string;
  pilotName: string;
  pricePerFlight: number;
  capacity: number;
  features: string[];
  soldOutDates: Date[];
  departureHelipad: string;
  landingHelipad: string;
  slug: string;
}

const HelicopterSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Sightseeing", "Heli-Trek", "Charter", "Rescue"], required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    pilotName: { type: String, required: true },
    pricePerFlight: { type: Number, required: true },
    capacity: { type: Number, required: true, default: 5 },
    features: [{ type: String }],
    soldOutDates: [{ type: Date }],
    departureHelipad: { type: String },
    landingHelipad: { type: String },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

export const Helicopter: Model<IHelicopter> =
  mongoose.models.Helicopter || mongoose.model<IHelicopter>("Helicopter", HelicopterSchema);
