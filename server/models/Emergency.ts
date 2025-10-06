// server/models/Emergency.ts
import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  emergencyTypes: [{
    type: String,
    required: true,
    enum: ['injury', 'breathing', 'unconscious', 'allergic', 'chest-pain', 'other']
  }],
  hasRecording: Boolean,
  recordingTime: Number,
  hasPhoto: Boolean,
  photoUrl: String,
  additionalDetails: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  locationName: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: Number,
    required: true,
    min: 1
  },
  // Remove the reportedBy field since we're not using user authentication
  // reportedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: false
  // }
}, { 
  timestamps: true 
});

// Create a 2dsphere index for geospatial queries
emergencySchema.index({ location: '2dsphere' });

export default mongoose.models.Emergency || mongoose.model('Emergency', emergencySchema);