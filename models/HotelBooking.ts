import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHotelBooking extends Document {
  hotelId: mongoose.Types.ObjectId | any;
  roomType: 'Standard' | 'Deluxe';
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestName: string;
  guestEmail: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const HotelBookingSchema: Schema = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Standard', 'Deluxe'],
      required: true,
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    guestName: {
      type: String,
      required: true,
    },
    guestEmail: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const HotelBooking: Model<IHotelBooking> =
  mongoose.models.HotelBooking || mongoose.model<IHotelBooking>('HotelBooking', HotelBookingSchema);
