import mongoose, { Document, Schema } from 'mongoose';

export interface ILostItem extends Document {
  category: string;
  details: {
    brand?: string;
    model?: string;
    color?: string;
    photoUrls: string[];
    uniqueFeatures?: string;
  };
  location?: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  locationName: string;
  lostDateTime: Date;
  context?: string;
  status: 'lost' | 'found' | 'claimed';
  // userId: Schema.Types.ObjectId; // Optional: to link to a user
}

const LostItemSchema = new Schema<ILostItem>(
  {
    category: { type: String, required: true },
    details: {
      brand: { type: String },
      model: { type: String },
      color: { type: String },
      photoUrls: [{ type: String }],
      uniqueFeatures: { type: String, default: '' },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
    locationName: { type: String, required: true },
    lostDateTime: { type: Date, required: true },
    context: { type: String },
    status: {
      type: String,
      enum: ['lost', 'found', 'claimed'],
        default: 'lost',
    },
    // userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

LostItemSchema.index({ location: '2dsphere' });

export default mongoose.model<ILostItem>('LostItem', LostItemSchema);
