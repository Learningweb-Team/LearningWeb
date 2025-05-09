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
export const publishCourse = async (req, res) => {
  try {
    const { title, description, coverPhoto, modules } = req.body;

    // Validate required fields with more specific error messages
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required and cannot be empty'
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course description is required and cannot be empty'
      });
    }

    // Validate cover photo with Cloudinary URL check
    if (!coverPhoto?.url || !coverPhoto.url.startsWith('https://res.cloudinary.com')) {
      return res.status(400).json({
        success: false,
        message: 'Valid course cover photo URL from Cloudinary is required'
      });
    }

    // Validate modules structure
    if (!Array.isArray(modules) || modules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one module is required'
      });
    }

    // Transform and validate each module
    const transformedModules = modules.map((module, index) => {
      // Module validation
      if (!module.title?.trim()) {
        throw new Error(`Module ${index + 1} title is required`);
      }

      // Validate module cover photo if exists
      if (module.coverPhoto?.url && !module.coverPhoto.url.startsWith('https://res.cloudinary.com')) {
        throw new Error(`Module ${module.title} has invalid cover photo URL`);
      }

      // Validate classes
      if (!Array.isArray(module.classes) || module.classes.length === 0) {
        throw new Error(`Module "${module.title}" must have at least one class`);
      }

      const validatedClasses = module.classes.map(cls => {
        if (!cls.title?.trim()) {
          throw new Error(`Class title in module "${module.title}" is required`);
        }

        // Validate video URL if exists
        if (cls.videoUrl && !cls.videoUrl.startsWith('https://res.cloudinary.com')) {
          throw new Error(`Class "${cls.title}" has invalid video URL`);
        }

        return {
          title: cls.title.trim(),
          week: cls.week?.trim() || `Week ${module.classes.indexOf(cls) + 1}`,
          description: cls.description?.trim() || '',
          videoUrl: cls.videoUrl || '',
          publicId: cls.publicId || '',
          duration: cls.duration || 0
        };
      });

      return {
        title: module.title.trim(),
        description: module.description?.trim() || '',
        coverPhotoUrl: module.coverPhoto?.url || '',
        coverPhotoPublicId: module.coverPhoto?.publicId || '',
        classes: validatedClasses,
        assignments: module.assignments || []
      };
    });

    // Check for duplicate module titles
    const moduleTitles = transformedModules.map(m => m.title.toLowerCase());
    if (new Set(moduleTitles).size !== moduleTitles.length) {
      return res.status(400).json({
        success: false,
        message: 'Module titles must be unique'
      });
    }

    // Create new course with additional metadata
    const course = new Course({
      title: title.trim(),
      description: description.trim(),
      coverPhotoUrl: coverPhoto.url,
      coverPhotoPublicId: coverPhoto.publicId,
      modules: transformedModules,
      isPublished: true,
      publishedAt: new Date(),
      createdBy: req.user?._id, // Assuming you have user authentication
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    });

    // Save course with transaction for better error handling
    const savedCourse = await course.save();

    // Log successful publication
    console.log(`Course "${title}" published successfully by user ${req.user?._id}`);

    return res.status(201).json({
      success: true,
      data: {
        ...savedCourse.toObject(),
        totalModules: savedCourse.modules.length,
        totalClasses: savedCourse.modules.reduce((sum, module) => sum + module.classes.length, 0)
      },
      message: 'Course published successfully!'
    });

  } catch (error) {
    console.error('Publish error:', error);
    
    // Handle duplicate key error (unique title)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Course title already exists. Please choose a different title.',
        field: 'title'
      });
    }

    // Handle validation errors
    if (error.message.includes('Module') || error.message.includes('Class')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        field: error.message.includes('Module') ? 'modules' : 'classes'
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Failed to publish course',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};