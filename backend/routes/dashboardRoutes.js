// routes/dashboardRoutes.js
import express from "express";
import { authMiddleware, admin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Admin Profile Route
router.get("/admin/profile", authMiddleware, admin, async (req, res) => {
  try {
    const adminProfile = await User.findById(req.user.id).select("-password");
    if (!adminProfile) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin: adminProfile });
  } catch (error) {
    console.error("❌ Admin Profile Fetch Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Dashboard Route
router.get("/user-dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phoneNumber : user.phone || "Not Provided",
        role: user.role,
        image: user.image || null,
        courses: user.courses || [],
      },
    });
  } catch (error) {
    console.error("❌ User Dashboard Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
