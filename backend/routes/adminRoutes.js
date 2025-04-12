// routes/adminRoutes.js
import express from 'express';
import {
  createCourse,
  addModule,
  uploadCoverPhoto,
  uploadClassVideo,
  getAdminProfile
} from '../controllers/adminController.js';

import { videoUpload, imageUpload } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin profile
router.route('/profile')
  .get(protect, admin, getAdminProfile);

// Create course
router.route('/courses')
  .post(protect, admin, createCourse);

// Add module to course
router.route('/courses/:courseId/modules')
  .post(protect, admin, addModule);

// Upload module cover photo
router.post(
  '/courses/:courseId/modules/:moduleId/cover',
  protect,
  admin,
  (req, res, next) => {
    imageUpload(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Image upload failed'
        });
      }
      next();
    });
  },
  uploadCoverPhoto
);

// Upload class video
router.post(
  '/courses/:courseId/modules/:moduleId/classes/:classId/video',
  protect,
  admin,
  (req, res, next) => {
    videoUpload(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Video upload failed'
        });
      }
      next();
    });
  },
  uploadClassVideo
);

export default router;
