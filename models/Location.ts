import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation extends Document {
  name: string;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const Location: Model<ILocation> = mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
