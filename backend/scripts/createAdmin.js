import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js"; // Adjust path based on your project structure

dotenv.config();

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ Database Connection Error:", err));

const createAdmin = async () => {
  try {
    // ✅ Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    // ✅ Hash the password correctly
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // ✅ Create and save admin user
    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,  // ✅ FIXED: Use hashed password
      phone: "9566163816",
      role: "admin",
      courses: []
    });

    await admin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

// ✅ Run the function
createAdmin();
