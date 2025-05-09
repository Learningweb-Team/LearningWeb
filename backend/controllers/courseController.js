// controllers/courseController.js
import Course from '../models/Course.js';

// Get all published courses
// controllers/courseController.js
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('title description coverPhotoUrl modules publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Get single course details
export const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate({
        path: 'modules.classes',
        select: 'title week description videoUrl duration'
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};