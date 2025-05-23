import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    active: { type: Boolean, default: true },
    approved: { type: Boolean, default: true },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    image: {
      type: String,
      required: false // Optional now
    },
    token: { type: String },
    resetPasswordTokenExpires: { type: Date },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress'
      }
    ]
  },

  
  { timestamps: true }
);
// In User model, keep this pre-save hook:
userSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();

  try {
    console.log('Hashing new password');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('Password hashing error:', err);
    next(err);
  }
});
const User = mongoose.model('User', userSchema);
export default User;
