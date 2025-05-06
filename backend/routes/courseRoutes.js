import express from 'express';
import { videoUpload, imageUpload } from '../middleware/uploadMiddleware.js';
import { 
  uploadClassVideo, 
  uploadCoverPhoto, 
  getAdminProfile,
  createCourse  // Make sure this is imported
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import Course from '../models/Course.js';  // Import Course model

const router = express.Router();

// Admin profile route
router.route('/profile')
  .get(protect, admin, getAdminProfile);

// Video upload route
router.route('/:courseId/modules/:moduleId/classes/:classId/video')
  .post(
    protect,
    admin,
    (req, res, next) => {
      videoUpload(req, res, (err) => {
        if (err) {
          console.error('Video upload error:', err);
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }
        next();
      });
    },
    uploadClassVideo
  );

// Image upload route
router.route('/:courseId/cover')
  .post(
    protect,
    admin,
    (req, res, next) => {
      imageUpload(req, res, (err) => {
        if (err) {
          console.error('Image upload error:', err);
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }
        next();
      });
    },
    uploadCoverPhoto
  );

// Create new course route
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, coverPhotoUrl, coverPhotoPublicId, modules } = req.body;

    const course = new Course({
      title,
      description,
      coverPhotoUrl,
      coverPhotoPublicId,
      modules
    });

    const createdCourse = await course.save();

    res.status(201).json({
      success: true,
      data: createdCourse
    });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
export default router;