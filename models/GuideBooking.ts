import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * GuideBooking model — dedicated schema for guide-specific bookings.
 * Tracks service category, date ranges, group size, pricing,
 * and booking lifecycle status.
 */
export interface IGuideBooking extends Document {
  bookingId: string;
  guideId: mongoose.Types.ObjectId;
  guideName: string;
  serviceCategory: 'city_tour' | 'trekking' | 'mountaineering';
  
  // Customer info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Booking details
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  groupSize: number;
  pickupLocation?: string;
  specialNotes?: string;
  
  // Pricing
  pricePerDay: number;
  totalAmount: number;
  
  // Status
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const GuideBookingSchema: Schema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    guideId: {
      type: Schema.Types.ObjectId,
      ref: 'Guide',
      required: [true, 'Guide ID is required'],
    },
    guideName: {
      type: String,
      required: [true, 'Guide name is required'],
      trim: true,
    },
    serviceCategory: {
      type: String,
      enum: ['city_tour', 'trekking', 'mountaineering'],
      required: [true, 'Service category is required'],
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: [1, 'Minimum 1 day required'],
    },
    groupSize: {
      type: Number,
      required: true,
      min: [1, 'Minimum group size is 1'],
    },
    pickupLocation: {
      type: String,
      default: '',
      trim: true,
    },
    specialNotes: {
      type: String,
      default: '',
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const GuideBooking: Model<IGuideBooking> =
  mongoose.models.GuideBooking || mongoose.model<IGuideBooking>('GuideBooking', GuideBookingSchema);
