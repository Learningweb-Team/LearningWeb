import mongoose from "mongoose";

// Class Schema
// In Course model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  coverPhotoUrl: String,
  coverPhotoPublicId: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  modules: [{
    title: String,
    description: String,
    coverPhotoUrl: String,
    coverPhotoPublicId: String,
    classes: [{
      title: String,
      week: String,
      description: String,
      videoUrl: String,
      publicId: String,
      duration: Number
    }],
    assignments: [{
      title: String,
      files: [{
        url: String,
        publicId: String
      }]
    }]
  }]
}, { timestamps: true });

// Model Export
const Course = mongoose.model("Course", courseSchema);
export default Course;