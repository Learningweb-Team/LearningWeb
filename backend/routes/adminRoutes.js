// routes/adminRoutes.js
import express from 'express';
import {
  createCourse,
  addModule,
  uploadCoverPhoto,
  uploadClassVideo,
  getAdminProfile,
  publishCourse
} from '../controllers/adminController.js';
import { videoUpload, imageUpload } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin profile route
router.route('/profile')
  .get(protect, admin, getAdminProfile);

// Course creation route
router.route('/courses')
  .post(protect, admin, createCourse);

// Module addition route
router.route('/courses/:courseId/modules')
  .post(protect, admin, addModule);

// Video upload route with error handling
router.route('/courses/:courseId/modules/:moduleId/classes/:classId/video')
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

// Cover photo upload route with error handling
router.route('/courses/:courseId/cover')
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

// Course publishing route - using the controller function
router.post('/publish', protect, admin, publishCourse);
export default router;