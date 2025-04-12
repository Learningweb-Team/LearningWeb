import React, { useState, useRef } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminMainContent from './AdminMainContent';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Courses');
  const [activeModuleId, setActiveModuleId] = useState(1); // Track which module is active
  const [modules, setModules] = useState([
    {
      id: 1,
      title: 'Module 1: Digital Marketing Fundamentals',
      description: 'This module covers core concepts including SEO, SEM, and social media marketing.',
      classes: [
        {
          id: 1,
          title: 'Introduction to Digital Marketing',
          week: 'Week 1',
          description: 'Learn the digital marketing landscape',
          videoUrl: '',
          publicId: ''
        }
      ],
      assignments: [{ id: 1, title: 'Create SEO Strategy' }],
      coverPhotoUrl: '',
      coverPhotoPublicId: ''
    }
  ]);

  const [courseTitle, setCourseTitle] = useState('Digital Marketing Masterclass');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file, resourceType = 'image', moduleId = null) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('resource_type', resourceType);

    // Add folder information if it's a module cover photo
    if (resourceType === 'image' && moduleId) {
      formData.append('folder', `e-learning/courses/${courseTitle}/modules/${moduleId}/images`);
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (moduleId, classId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setSuccessMessage('');
    setUploadProgress(0);

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid video file (MP4, WebM, or QuickTime)');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setUploadError('Video file is too large (max 100MB)');
      return;
    }

    const uploadResult = await uploadToCloudinary(file, 'video');
    if (uploadResult) {
      setModules(prevModules => prevModules.map(module => 
        module.id === moduleId ? {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId ? { 
              ...cls, 
              videoUrl: uploadResult.url,
              publicId: uploadResult.publicId
            } : cls
          )
        } : module
      ));

      setSuccessMessage('Video uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const removeVideo = (moduleId, classId) => {
    setModules(prevModules => prevModules.map(module => 
      module.id === moduleId ? {
        ...module,
        classes: module.classes.map(cls => 
          cls.id === classId ? { 
            ...cls, 
            videoUrl: '',
            publicId: ''
          } : cls
        )
      } : module
    ));
  };

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setSuccessMessage('');

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('Image file is too large (max 5MB)');
      return;
    }

    // Upload to Cloudinary immediately when selected
    const uploadResult = await uploadToCloudinary(file, 'image', activeModuleId);
    if (uploadResult) {
      setModules(prevModules => prevModules.map(module => 
        module.id === activeModuleId ? {
          ...module,
          coverPhotoUrl: uploadResult.url,
          coverPhotoPublicId: uploadResult.publicId
        } : module
      ));

      // Set local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto({ 
          preview: reader.result,
          url: uploadResult.url,
          publicId: uploadResult.publicId
        });
      };
      reader.readAsDataURL(file);

      setSuccessMessage('Cover photo uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const removeCoverPhoto = async () => {
    try {
      const module = modules.find(m => m.id === activeModuleId);
      if (!module) return;

      // Delete from Cloudinary if publicId exists
      if (module.coverPhotoPublicId) {
        await fetch(`/api/admin/delete-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ publicId: module.coverPhotoPublicId })
        });
      }

      setModules(prevModules => prevModules.map(m => 
        m.id === activeModuleId ? {
          ...m,
          coverPhotoUrl: '',
          coverPhotoPublicId: ''
        } : m
      ));

      setCoverPhoto(null);
      setSuccessMessage('Cover photo removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setUploadError('Failed to remove cover photo');
    }
  };

  const handleUploadToCourses = async () => {
    try {
      setUploading(true);
      setUploadError('');
      setSuccessMessage('');

      // Upload any videos that haven't been uploaded yet
      const updatedModules = [...modules];
      const moduleIndex = updatedModules.findIndex(m => m.id === activeModuleId);
      
      if (moduleIndex !== -1) {
        // Upload videos for classes
        for (const cls of updatedModules[moduleIndex].classes) {
          if (!cls.videoUrl && cls.videoFile) {
            const uploadResult = await uploadToCloudinary(cls.videoFile, 'video');
            if (uploadResult) {
              cls.videoUrl = uploadResult.url;
              cls.publicId = uploadResult.publicId;
            }
          }
        }

        setModules(updatedModules);
        setSuccessMessage('Module uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      setUploadError('Failed to upload module: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <AdminMainContent
        courseTitle={courseTitle}
        setCourseTitle={setCourseTitle}
        modules={modules}
        setModules={setModules}
        activeModuleId={activeModuleId}
        setActiveModuleId={setActiveModuleId}
        uploading={uploading}
        fileInputRef={fileInputRef}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        successMessage={successMessage}
        handleVideoUpload={handleVideoUpload}
        removeVideo={removeVideo}
        onUploadToCourses={handleUploadToCourses}
        coverPhoto={coverPhoto?.preview || modules.find(m => m.id === activeModuleId)?.coverPhotoUrl}
        setCoverPhoto={handleCoverPhotoUpload}
        removeCoverPhoto={removeCoverPhoto}
      />
    </div>
  );
};

export default Admin;