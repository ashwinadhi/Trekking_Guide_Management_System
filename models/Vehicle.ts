import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  type: 'Jeep' | 'Van' | 'Bus';
  image: string;
  description: string;
  driverName: string;
  pricePerDay: number;
  features: string[];
  soldOutDates: Date[];
  pickupLocation: string;
  dropOffLocation: string;
  slug: string;
}

const VehicleSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Jeep', 'Van', 'Bus'], required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  driverName: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  features: [{ type: String }],
  soldOutDates: [{ type: Date }],
  pickupLocation: { type: String },
  dropOffLocation: { type: String },
  slug: { type: String, unique: true },
}, { timestamps: true });

// Slug generation is handled in the API routes to ensure uniqueness across the collection
export const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
