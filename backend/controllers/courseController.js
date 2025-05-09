// controllers/courseController.js
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';

// Get all published courses
// controllers/courseController.js
export const getCourses = async (req, res) => {
  try {
    console.log('Fetching published courses...');
    const courses = await Course.find({ isPublished: true })
      .select('title description coverPhotoUrl modules publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    console.log(`Found ${courses.length} published courses`);
    
    res.status(200).json({
      success: true,
      data: courses // Changed from data: courses to match frontend expectation
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Get single course details
// controllers/courseController.js

// Get single course details (updated)
export const getCourseDetails = async (req, res) => {
  try {
    console.log(`Fetching course details for ID: ${req.params.courseId}`);
    
    const course = await Course.findById(req.params.courseId)
      .select('title description coverPhotoUrl modules isPublished')
      .lean();

    if (!course) {
      console.log('Course not found');
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is published (for non-admin users)
    if (!course.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'This course is not available'
      });
    }

    let responseData = { ...course };

    // For authenticated users, include progress
    if (req.user) {
      const userProgress = await Progress.findOne({
        userId: req.user.id,
        courseId: req.params.courseId
      }).lean();

      responseData.userProgress = userProgress || null;
    }

    console.log('Sending course data:', responseData);
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

