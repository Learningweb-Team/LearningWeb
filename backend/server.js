import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import connectDB from "./config/db.js"; 
import courseRoutes from "./routes/courseRoutes.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js"; 

dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Secure CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
}));

// Debugging Middleware (Only in Development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
    if (Object.keys(req.body).length) console.log("📌 Request Body:", req.body);
    next();
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);

// Cloudinary Upload Route
app.post('/api/upload/video', async (req, res) => {
  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const videoFile = req.files.video;
    
    const result = await cloudinary.uploader.upload(videoFile.tempFilePath, {
      resource_type: "video",
      folder: "videos",
      chunk_size: 6000000
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      message: 'Video upload failed',
      error: error.message 
    });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));