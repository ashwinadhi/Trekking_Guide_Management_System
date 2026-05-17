import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Notification model — stores admin notifications for bookings,
 * payments, guide alerts, and system events.
 */
export interface INotification extends Document {
  type: 'new_booking' | 'booking_approved' | 'booking_cancelled' | 'payment_received' | 'guide_booking' | 'car_booking' | 'trek_booking' | 'system';
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: 'booking' | 'guide_booking' | 'vehicle_booking' | 'guide' | 'user';
  navigateTo?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['new_booking', 'booking_approved', 'booking_cancelled', 'payment_received', 'guide_booking', 'car_booking', 'trek_booking', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    referenceId: {
      type: String,
      default: '',
    },
    referenceType: {
      type: String,
      enum: ['booking', 'guide_booking', 'vehicle_booking', 'guide', 'user'],
    },
    navigateTo: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
