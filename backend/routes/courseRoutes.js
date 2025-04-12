import express from 'express';
import { videoUpload, imageUpload } from '../middleware/uploadMiddleware.js';
import { uploadClassVideo, uploadCoverPhoto, getAdminProfile } from '../controllers/adminController.js';
import { authMiddleware as protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin profile route
router.route('/profile')
  .get(protect, admin, getAdminProfile);

// Video upload route (with proper error handling)
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

// Image upload route (with proper error handling)
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

export default router;