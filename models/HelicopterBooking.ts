import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHelicopterBooking extends Document {
  helicopterId: mongoose.Types.ObjectId;
  helicopterName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureHelipad: string;
  landingHelipad: string;
  startDate: string;
  endDate: string;
  passengers: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const HelicopterBookingSchema: Schema = new Schema(
  {
    helicopterId: { type: Schema.Types.ObjectId, ref: "Helicopter", required: true },
    helicopterName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    departureHelipad: { type: String, required: true },
    landingHelipad: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    passengers: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export const HelicopterBooking: Model<IHelicopterBooking> =
  mongoose.models.HelicopterBooking ||
  mongoose.model<IHelicopterBooking>("HelicopterBooking", HelicopterBookingSchema);
