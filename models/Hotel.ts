import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoom {
  type: 'Standard' | 'Deluxe';
  price: number;
  features: string[];
  amenities: string[];
  roomImages: string[];
  totalRooms: number;
  soldOutDates: string[]; // Keep as strings in YYYY-MM-DD for easy serialization
}

export interface IHotel extends Document {
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  destinationId: mongoose.Types.ObjectId | any;
  rooms: IRoom[];
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Standard', 'Deluxe'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    features: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    roomImages: {
      type: [String],
      default: [],
    },
    totalRooms: {
      type: Number,
      required: true,
      min: [1, 'Must have at least 1 room'],
    },
    soldOutDates: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const HotelSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    rooms: {
      type: [RoomSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Hotel: Model<IHotel> = mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema);
