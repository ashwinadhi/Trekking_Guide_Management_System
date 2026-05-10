import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  category: 'hotels' | 'equipment' | 'trek routes';
  price?: number;
  images: string[];
  location: string;
  createdAt: Date;
}

const ServiceSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['hotels', 'equipment', 'trek routes'],
    required: true,
  },
  price: {
    type: Number,
  },
  images: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
