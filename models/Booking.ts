import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Booking model — unified schema for all booking types:
 *   - "guide"     → Tour guide booking (/booking page)
 *   - "hotel"     → Hotel booking (/hotels page)
 *   - "equipment" → Equipment rental checkout (/equipment page cart)
 *   - "car"       → Car rental booking (/car-booking page)
 *
 * The legacy fields (serviceId, date) remain optional so existing
 * admin-dashboard bookings are not broken.
 */
export interface IBooking extends Document {
  // ─── Who is booking ──────────────────────────────────────────────
  userId?: string;          // sessionId for guests, user ID if logged in
  bookingType: 'guide' | 'hotel' | 'equipment' | 'car' | 'service';
  name: string;
  email: string;
  phone?: string;

  // ─── Legacy fields (kept for admin-dashboard compatibility) ──────
  serviceId?: mongoose.Types.ObjectId;
  date?: string;
  message?: string;

  // ─── Flexible booking details (type-specific data stored here) ───
  bookingDetails?: Record<string, any>;

  // ─── Cart items for equipment rental ─────────────────────────────
  cartItems?: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    rentalDays: number;
  }[];

  // ─── Financials ───────────────────────────────────────────────────
  totalPrice?: number;
  paymentMethod?: string;

  // ─── Status ───────────────────────────────────────────────────────
  status: 'pending' | 'confirmed' | 'cancelled';

  createdAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    userId: {
      type: String,
    },
    bookingType: {
      type: String,
      enum: ['guide', 'hotel', 'equipment', 'car', 'service'],
      required: true,
      default: 'service',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // ── Legacy ───────────────────────────────────────────────────────
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    date: {
      type: String,
    },
    message: {
      type: String,
    },

    // ── Flexible payload ─────────────────────────────────────────────
    bookingDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // ── Cart items (equipment rental) ────────────────────────────────
    cartItems: [
      {
        itemId: { type: String },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        rentalDays: { type: Number, default: 1 },
      },
    ],

    totalPrice: {
      type: Number,
      min: 0,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);
