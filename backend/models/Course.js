// models/Course.js
import mongoose from "mongoose";

// Class Schema
const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  week: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  publicId: { type: String },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: true });

// Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  files: [
    {
      url: { type: String },
      publicId: { type: String }
    }
  ]
});

// Module Schema
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverPhotoUrl: { type: String },
  coverPhotoPublicId: { type: String },
  classes: [classSchema],
  assignments: [assignmentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  modules: [moduleSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Model Export
const Course = mongoose.model("Course", courseSchema);
export default Course;
