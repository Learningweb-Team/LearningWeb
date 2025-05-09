// controllers/adminController.js
import Course from '../models/Course.js';  // Changed from 'Courses' to 'Course'
import cloudinary from '../config/cloudinary.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, coverPhotoUrl, coverPhotoPublicId, modules } = req.body;

    const course = new Course({
      title,
      description,
      coverPhotoUrl,
      coverPhotoPublicId,
      modules
    });

    await course.save();
    
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add a module to a course
export const addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          modules: { title, description }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(201).json({
      success: true,
      data: course.modules[course.modules.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add module',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Upload module cover photo
// controllers/adminController.js
export const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { courseId, moduleId } = req.params;

    const course = await Course.findOneAndUpdate(
      { 
        _id: courseId,
        'modules._id': moduleId 
      },
      {
        $set: {
          'modules.$.coverPhotoUrl': req.file.secure_url,
          'modules.$.coverPhotoPublicId': req.file.public_id,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!course) {
      // Clean up the uploaded file if the course/module wasn't found
      await cloudinary.uploader.destroy(req.file.public_id);
      return res.status(404).json({
        success: false,
        message: 'Course or module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.secure_url,
        publicId: req.file.public_id
      }
    });
  } catch (error) {
    // Clean up the uploaded file if an error occurred
    if (req.file?.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload cover photo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Upload class video
export const uploadClassVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    const { courseId, moduleId, classId } = req.params;
    const { title, week, description } = req.body;

    const updateData = {
      'modules.$[module].classes.$[class].videoUrl': req.file.secure_url,
      'modules.$[module].classes.$[class].publicId': req.file.public_id,
      'modules.$[module].classes.$[class].duration': req.file.duration,
      updatedAt: new Date()
    };

    if (title) updateData['modules.$[module].classes.$[class].title'] = title;
    if (week) updateData['modules.$[module].classes.$[class].week'] = week;
    if (description) updateData['modules.$[module].classes.$[class].description'] = description;

    const course = await Course.findOneAndUpdate(
      { _id: courseId },
      { $set: updateData },
      {
        new: true,
        arrayFilters: [
          { 'module._id': moduleId },
          { 'class._id': classId }
        ]
      }
    );

    if (!course) {
      await cloudinary.uploader.destroy(req.file.public_id);
      return res.status(404).json({
        success: false,
        message: 'Course, module, or class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        url: req.file.secure_url,
        publicId: req.file.public_id,
        duration: req.file.duration
      }
    });
  } catch (error) {
    if (req.file?.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get admin profile (added to fix the previous error)
export const getAdminProfile = async (req, res) => {
  try {
    // Implement your admin profile logic here
    res.status(200).json({
      success: true,
      data: {
        name: "Admin Name",
        email: "admin@example.com"
        // Add other admin profile fields
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get admin profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// controllers/adminController.js

// New endpoint to handle complete course publishing
// In adminController.js - update publishCourse
// controllers/adminController.js
// controllers/adminController.js
export const publishCourse = async (req, res) => {
  try {
    const { title, description, coverPhoto, modules } = req.body;
    console.log('Received publish request:', { title, coverPhoto, modules });

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required'
      });
    }

    if (!coverPhoto?.url) {
      return res.status(400).json({
        success: false,
        message: 'Course cover photo is required'
      });
    }

    // Validate Cloudinary URL format
    if (!coverPhoto.url.startsWith('https://res.cloudinary.com')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cover photo URL format'
      });
    }

    // Validate modules
    if (!Array.isArray(modules) || modules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one module is required'
      });
    }

    // Create and save course
    const course = new Course({
      title: title.trim(),
      description: description?.trim() || 'No description provided',
      coverPhotoUrl: coverPhoto.url,
      coverPhotoPublicId: coverPhoto.publicId || '',
      modules: modules.map(module => ({
        title: module.title,
        description: module.description,
        coverPhotoUrl: module.coverPhoto?.url || '',
        coverPhotoPublicId: module.coverPhoto?.publicId || '',
        classes: module.classes.map(cls => ({
          title: cls.title,
          week: cls.week,
          description: cls.description,
          videoUrl: cls.videoUrl,
          publicId: cls.publicId,
          duration: cls.duration || 0
        })),
        assignments: module.assignments || []
      })),
      isPublished: true,
      publishedAt: new Date()
    });

    const savedCourse = await course.save();
    console.log('Course saved:', savedCourse._id);

    res.status(201).json({
      success: true,
      data: savedCourse
    });
  } catch (error) {
    console.error('Publish error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Course title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to publish course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};