// models/Progress.js
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId }],
  lastWatchedVideo: { type: mongoose.Schema.Types.ObjectId },
  percentage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;