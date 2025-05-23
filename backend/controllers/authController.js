import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      image = "",
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists. Please log in." 
      });
    }

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (default role is 'student')
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      image,
      role: "user" // Default role
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response
    res.status(201).json({
      success: true,
      token,
      role: newUser.role,
      userId: newUser._id,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server Error. Please try again later." 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required." 
      });
    }

    // Case-insensitive email search
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials." 
      });
    }

    // Remove password logging for security
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials." 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response
    res.status(200).json({
      success: true,
      token,
      role: user.role,
      userId: user._id,
      message: "Logged in successfully",
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Server Error. Please try again later." 
    });
  }
};