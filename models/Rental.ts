import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRental extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  deliveryLocation: string;
  items: {
    equipmentId: mongoose.Types.ObjectId | any;
    name: string;
    quantity: number;
    dailyPrice: number;
  }[];
  totalPrice: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    items: [
      {
        equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        dailyPrice: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    specialRequests: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Rental: Model<IRental> =
  mongoose.models.Rental || mongoose.model<IRental>('Rental', RentalSchema);
