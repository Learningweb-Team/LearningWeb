
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import AdminMainContent from './AdminMainContent';
const Admin = () => {
  const [activeTab, setActiveTab] = useState('Courses');
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
          publicId: '',
          isEditing: false
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
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [coverPhoto, setCoverPhoto] = useState({ file: null, url: '',publicId: '',isUploaded: false });
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [videoPreview, setVideoPreview] = useState(null);
  const backgroundRef = useRef(null);

  // Interactive background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (backgroundRef.current) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        backgroundRef.current.style.setProperty('--x', x);
        backgroundRef.current.style.setProperty('--y', y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const uploadToCloudinary = async (file, resourceType = 'image', moduleId = null) => {
    if (!file) {
      console.error('No file provided for Cloudinary upload');
      return null;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('resource_type', resourceType);
  
    try {
      console.log(`Uploading ${resourceType} to Cloudinary...`);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        { method: 'POST', body: formData }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }
      
      const data = await response.json();
      console.log('Cloudinary upload successful:', data);
      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      setUploadError(`Failed to upload ${resourceType}: ${error.message}`);
      return null;
    }
  };

  const handleVideoUpload = (moduleId, classId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setSuccessMessage('');

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid video file (MP4, WebM, or QuickTime)');
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Video file is too large (max 100MB)');
      return;
    }

    setModules(prevModules => prevModules.map(module => 
      module.id === moduleId ? {
        ...module,
        classes: module.classes.map(cls => 
          cls.id === classId ? { 
            ...cls, 
            videoFile: file,
            videoUrl: URL.createObjectURL(file) // For preview
          } : cls
        )
      } : module
    ));
  };

  const removeVideo = (moduleId, classId) => {
    setModules(prevModules => prevModules.map(module => 
      module.id === moduleId ? {
        ...module,
        classes: module.classes.map(cls => 
          cls.id === classId ? { 
            ...cls, 
            videoUrl: '',
            publicId: '',
            videoFile: undefined
          } : cls
        )
      } : module
    ));
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploadError('');
    setSuccessMessage('');
  
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }
  
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Image file is too large (max 5MB)');
      return;
    }
  
    setCoverPhoto({
      file,
      url: URL.createObjectURL(file),
      publicId: '',
      isUploaded: false
    });
  };
  const removeCoverPhoto = () => {
    if (activeModuleId) {
      setModules(prevModules => prevModules.map(module => 
        module.id === activeModuleId ? {
          ...module,
          coverPhotoUrl: '',
          coverPhotoPublicId: '',
          coverPhotoFile: undefined
        } : module
      ));
    } else {
      setCoverPhoto({ file: null, url: '' });
    }
  };

// In your Admin component - update handleUploadToCourses
// Update the handleUploadToCourses function in Admin.jsx
const handleUploadToCourses = async () => {
  try {
    setUploading(true);
    setUploadError('');
    setSuccessMessage('');

    // Debug current state
    console.log('Current cover photo state:', coverPhoto);

    // Validate required fields
    if (!courseTitle.trim()) {
      throw new Error('Course title is required');
    }

    // Validate cover photo exists
    if (!coverPhoto.file) {
      throw new Error('Please upload a course cover photo');
    }

    // Upload cover photo if not already uploaded
    let coverPhotoResult = coverPhoto;
    if (!coverPhoto.isUploaded) {
      console.log('Starting course cover photo upload...');
      const uploadResult = await uploadToCloudinary(coverPhoto.file, 'image');
      if (!uploadResult?.url) {
        throw new Error('Failed to upload course cover photo to Cloudinary');
      }
      console.log('Course cover uploaded:', uploadResult.url);
      coverPhotoResult = {
        ...uploadResult,
        isUploaded: true
      };
    }

    // Process modules
    const updatedModules = [];
    for (const module of modules) {
      // Validate module
      if (!module.title.trim()) {
        throw new Error(`Module "${module.title}" title is required`);
      }

      // Upload module cover if exists
      let moduleCover = { url: '', publicId: '' };
      if (module.coverPhotoFile) {
        console.log(`Uploading cover for module ${module.id}...`);
        const coverResult = await uploadToCloudinary(module.coverPhotoFile, 'image', module.id);
        if (coverResult) {
          moduleCover = coverResult;
          console.log(`Module ${module.id} cover uploaded:`, coverResult.url);
        }
      }

      // Process classes
      const updatedClasses = [];
      for (const cls of module.classes) {
        if (!cls.title.trim()) {
          throw new Error(`Class title in module "${module.title}" is required`);
        }

        // Upload video if exists
        let videoData = { url: cls.videoUrl || '', publicId: cls.publicId || '' };
        if (cls.videoFile) {
          console.log(`Uploading video for class ${cls.title}...`);
          const videoResult = await uploadToCloudinary(cls.videoFile, 'video', module.id);
          if (videoResult) {
            videoData = videoResult;
            console.log(`Class ${cls.title} video uploaded:`, videoResult.url);
          }
        }

        updatedClasses.push({
          ...cls,
          videoUrl: videoData.url,
          publicId: videoData.publicId
        });
      }

      updatedModules.push({
        title: module.title,
        description: module.description,
        coverPhoto: moduleCover,
        classes: updatedClasses,
        assignments: module.assignments || []
      });
    }

    // Prepare final course data
    const courseData = {
      title: courseTitle,
      description: "Course description", // Add a way to set this in UI
      coverPhoto: {
        url: coverPhotoResult.url,
        publicId: coverPhotoResult.publicId
      },
      modules: updatedModules
    };

    console.log('Sending course data to server:', courseData);
    const response = await fetch('http://localhost:5000/api/admin/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData)
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to publish course');
    }

    setSuccessMessage('Course published successfully!');
    
    // Reset form after successful publish
    setCourseTitle('');
    setModules([{
      id: 1,
      title: 'Module 1: New Module',
      description: '',
      classes: [],
      assignments: [],
      coverPhotoUrl: '',
      coverPhotoPublicId: ''
    }]);
    setCoverPhoto({ file: null, url: '', publicId: '', isUploaded: false });
    
  } catch (error) {
    console.error('Publishing error:', error);
    setUploadError(error.message);
  } finally {
    setUploading(false);
  }
};
  const addNewClass = () => {
    const activeModule = modules.find(m => m.id === activeModuleId);
    if (!activeModule) return;

    const newClassId = activeModule.classes.length > 0 
      ? Math.max(...activeModule.classes.map(c => c.id)) + 1 
      : 1;

    setModules(modules.map(module => 
      module.id === activeModuleId
        ? {
            ...module,
            classes: [
              ...module.classes,
              {
                id: newClassId,
                title: 'New Lesson',
                week: `Week ${module.classes.length + 1}`,
                description: 'Lesson description',
                videoUrl: '',
                publicId: '',
                isEditing: false
              }
            ]
          }
        : module
    ));
  };

  return (
    <div 
      ref={backgroundRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        '--x': '0.5',
        '--y': '0.5',
        '--color-1': 'rgba(99, 102, 241, 0.1)',
        '--color-2': 'rgba(168, 85, 247, 0.1)',
        '--color-3': 'rgba(236, 72, 153, 0.1)',
      }}
    >
      {/* Interactive gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-70 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(
                circle at calc(var(--x) * 100%) calc(var(--y) * 100%),
                var(--color-1),
                transparent 50%
              ),
              radial-gradient(
                circle at calc(var(--x) * 80% + 10%) calc(var(--y) * 70% + 10%),
                var(--color-2),
                transparent 45%
              ),
              radial-gradient(
                circle at calc(var(--x) * 60% + 20%) calc(var(--y) * 50% + 20%),
                var(--color-3),
                transparent 40%
              ),
              linear-gradient(to bottom right,rgb(3, 162, 231),rgb(5, 214, 148))
            `,
            filter: 'blur(120px)',
            transform: 'scale(1.2)',
          }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="flex min-h-screen">
       

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <AdminMainContent
            courseTitle={courseTitle}
            setCourseTitle={setCourseTitle}
            modules={modules}
            setModules={setModules}
            activeModuleId={activeModuleId}
            setActiveModuleId={setActiveModuleId}
            uploading={uploading}
            uploadError={uploadError}
            successMessage={successMessage}
            handleVideoUpload={handleVideoUpload}
            removeVideo={removeVideo}
            onUploadToCourses={handleUploadToCourses}
            coverPhoto={coverPhoto.url}
            setCoverPhoto={handleCoverPhotoUpload}
            removeCoverPhoto={() => setCoverPhoto({ file: null, url: '', publicId: '', isUploaded: false })}
            videoPreview={videoPreview}
            setVideoPreview={setVideoPreview}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;