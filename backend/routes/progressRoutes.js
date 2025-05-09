import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getProgress, 
  updateWatchProgress,
  markVideoCompleted
} from '../controllers/progressController.js';

const router = express.Router();

// Get user progress for a course
router.get('/:courseId', protect, getProgress);

// Update watch progress
router.put('/:courseId/watch', protect, updateWatchProgress);

// Mark video as completed
router.post('/:courseId/complete', protect, markVideoCompleted);

export default router;