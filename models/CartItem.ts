import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * CartItem model — persists equipment cart items to MongoDB.
 * Uses sessionId (stored in localStorage) since there's no user-auth for guests.
 */
export interface ICartItem extends Document {
  sessionId: string;        // Browser-generated UUID or cookie ID
  itemId: string;           // ID of the equipment item
  itemType: string;         // e.g. "equipment", "tour", "hotel", "car"
  name: string;
  price: number;
  quantity: number;
  rentalDays: number;
  image?: string;
  category?: string;
  createdAt: Date;
}

const CartItemSchema: Schema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,          // Index for fast lookups by session
    },
    itemId: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      default: 'equipment',
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    rentalDays: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,       // Adds createdAt & updatedAt automatically
  }
);

export const CartItem: Model<ICartItem> =
  mongoose.models.CartItem ||
  mongoose.model<ICartItem>('CartItem', CartItemSchema);
