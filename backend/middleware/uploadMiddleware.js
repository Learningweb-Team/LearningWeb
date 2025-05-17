// middleware/uploadMiddleware.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Video Upload
const videoUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
      folder: `e-learning/courses/${req.params.courseId}/modules/${req.params.moduleId}/videos`,
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'webm'],
      transformation: [{ quality: 'auto' }]
    })
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (validTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid video file type'), false);
  }
}).single('video');

// Image Upload
const imageUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
      folder: `e-learning/courses/${req.params.courseId}/modules/${req.params.moduleId}/images`,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto' }]
    })
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (validTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid image file type'), false);
  }
}).single('image');

export { videoUpload, imageUpload };
