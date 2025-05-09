import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId }],
  lastWatchedVideo: { 
    videoId: { type: mongoose.Schema.Types.ObjectId },
    moduleId: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Number } // Last watched position in seconds
  },
  totalVideos: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Calculate percentage before saving
progressSchema.pre('save', function(next) {
  if (this.completedVideos && this.totalVideos > 0) {
    this.percentage = Math.round((this.completedVideos.length / this.totalVideos) * 100);
  }
  next();
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;