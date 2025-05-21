import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js'; // Add this import

const router = express.Router();

// GET /api/users/my-courses - Get enrolled courses with progress
// Updated /api/users/my-courses route
router.get('/my-courses', protect, async (req, res) => {
  try {
    const progressRecords = await Progress.find({ userId: req.user._id })
      .populate({
        path: 'courseId',
        select: 'title coverPhotoUrl description',
        populate: {
          path: 'modules',
          select: 'title',
          populate: {
            path: 'classes',
            select: 'title duration _id' // Make sure to include _id
          }
        }
      });

    if (!progressRecords.length) {
      return res.json({ courses: [] });
    }

    const formattedCourses = await Promise.all(progressRecords.map(async (progress) => {
      const course = progress.courseId;
      
      // Calculate total videos in course
      const totalVideos = course.modules.reduce(
        (total, module) => total + (module.classes?.length || 0), 
        0
      );
      
      // Calculate actual progress percentage
      const completedVideos = progress.completedVideos?.length || 0;
      const percentage = totalVideos > 0 
        ? Math.round((completedVideos / totalVideos) * 100)
        : 0;

      return {
        _id: course._id,
        title: course.title,
        coverPhotoUrl: course.coverPhotoUrl,
        description: course.description,
        progress: percentage,
        totalLessons: totalVideos,
        modules: course.modules.map(module => ({
          title: module.title,
          lessons: module.classes?.length || 0
        }))
      };
    }));

    res.json({ courses: formattedCourses });
  } catch (err) {
    console.error('Error fetching enrolled courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ... (keep your existing /enrollment-status and /enroll routes)

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