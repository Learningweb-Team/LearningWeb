// server/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Progress from '../models/Progress.js';

const router = express.Router();

/**
 * @route GET /api/users/enrollment-status/:courseId
 * @desc Check if user is enrolled in a course and get progress
 * @access Private
 */
router.get('/enrollment-status/:courseId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    });
    
    res.json({
      success: true,
      isEnrolled: !!progress,
      lastWatchedVideo: progress?.lastWatchedVideo || null,
      completedVideos: progress?.completedVideos || [],
      percentage: progress?.percentage || 0
    });
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error checking enrollment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/users/enroll
 * @desc Enroll user in a course
 * @access Private
 */
router.post('/enroll', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      userId: req.user._id,
      courseId
    });

    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'User is already enrolled in this course'
      });
    }

    // Create new progress record
    const progress = new Progress({
      userId: req.user._id,
      courseId,
      completedVideos: [],
      totalVideos: 0, // Will be updated when course data is loaded
      percentage: 0
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      progress
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;