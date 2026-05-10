import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * ContactMessage model — stores contact form submissions from the /contact page.
 */
export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  trekInterest?: string;
  trekDates?: string;
  groupSize?: string;
  message?: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema(
  {
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
    country: {
      type: String,
      trim: true,
    },
    trekInterest: {
      type: String,
    },
    trekDates: {
      type: String,
    },
    groupSize: {
      type: String,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);

export const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
