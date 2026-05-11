import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicleBooking extends Document {
  vehicleId: mongoose.Types.ObjectId;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropOffLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const VehicleBookingSchema: Schema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropOffLocation: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export const VehicleBooking: Model<IVehicleBooking> = mongoose.models.VehicleBooking || mongoose.model<IVehicleBooking>('VehicleBooking', VehicleBookingSchema);
