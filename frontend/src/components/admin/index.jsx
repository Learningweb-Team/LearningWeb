import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar'; // Update path as needed
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
  const [courseDescription, setCourseDescription] = useState('Course description');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [coverPhoto, setCoverPhoto] = useState({ file: null, url: '', publicId: '', isUploaded: false });
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [videoPreview, setVideoPreview] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  
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

  useEffect(() => {
  const handleResize = () => {
    setMobileView(window.innerWidth < 768);
  };
  
  handleResize(); // Initial check
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
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

const handleVideoUpload = async (moduleId, classId, e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  setUploadError('');

  try {
    // Validate file type and size
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid video file (MP4, WebM, or QuickTime)');
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('Video file is too large (max 100MB)');
    }

    // Create preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('resource_type', 'video');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();

    // Update state with both preview and Cloudinary URLs
    setModules(prevModules => prevModules.map(module => 
      module.id === moduleId ? {
        ...module,
        classes: module.classes.map(cls => 
          cls.id === classId ? { 
            ...cls, 
            videoUrl: data.secure_url, // Cloudinary URL
            previewUrl, // Local preview URL
            publicId: data.public_id,
            duration: data.duration,
            videoFile: undefined // Clear file object
          } : cls
        )
      } : module
    ));

  } catch (error) {
    console.error('Video upload error:', error);
    setUploadError(error.message);
  } finally {
    setUploading(false);
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
  
    const maxSize = 10 * 1024 * 1024;
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
    setCoverPhoto({ file: null, url: '', publicId: '', isUploaded: false });
  };

  const handleUploadToCourses = async () => {
    try {
      setUploading(true);
      setUploadError('');
      setSuccessMessage('');

      if (!courseTitle.trim()) throw new Error('Course title is required');
      if (!coverPhoto.file) throw new Error('Cover photo is required');

      const uploadResult = await uploadToCloudinary(coverPhoto.file, 'image');
      if (!uploadResult?.url) throw new Error('Failed to upload cover photo');

      const courseData = {
        title: courseTitle,
        description: courseDescription,
        coverPhoto: uploadResult,
        modules: modules.map(module => ({
          title: module.title,
          description: module.description,
          classes: module.classes.map(cls => ({
            title: cls.title,
            description: cls.description,
            videoUrl: cls.videoUrl,
            publicId: cls.publicId
          })),
          assignments: module.assignments
        }))
      };

      const response = await fetch('http://localhost:5000/api/admin/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(courseData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to publish course');

      setSuccessMessage('Course published successfully!');
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
const handlePublish = async () => {
  setUploading(true);
  setUploadError('');
  setSuccessMessage('');

  try {
    // First upload cover photo if needed
    let coverPhotoUrl = coverPhoto.url;
    let coverPhotoPublicId = coverPhoto.publicId;
    
    if (coverPhoto.file && !coverPhoto.isUploaded) {
      const result = await uploadToCloudinary(coverPhoto.file, 'image');
      if (!result) throw new Error('Failed to upload cover photo');
      coverPhotoUrl = result.url;
      coverPhotoPublicId = result.publicId;
    }

    // Upload all pending videos
    const updatedModules = await Promise.all(modules.map(async module => {
      const updatedClasses = await Promise.all(module.classes.map(async cls => {
        if (cls.videoFile) {
          const result = await uploadToCloudinary(cls.videoFile, 'video');
          if (!result) throw new Error(`Failed to upload video for ${cls.title}`);
          return {
            ...cls,
            videoUrl: result.url,
            publicId: result.publicId,
            videoFile: undefined
          };
        }
        return cls;
      }));
      
      return {
        ...module,
        classes: updatedClasses
      };
    }));

    // Prepare course data
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      coverPhoto: {
        url: coverPhotoUrl,
        publicId: coverPhotoPublicId
      },
      modules: updatedModules.map(module => ({
        title: module.title,
        description: module.description,
        classes: module.classes.map(cls => ({
          title: cls.title,
          week: cls.week,
          description: cls.description,
          videoUrl: cls.videoUrl,
          publicId: cls.publicId,
          duration: cls.duration || 0
        })),
        assignments: module.assignments
      }))
    };

    // Send to backend
    const response = await fetch('http://localhost:5000/api/admin/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to publish course');

    setSuccessMessage('Course published successfully!');
    setShowSuccessModal(true);
    
  } catch (error) {
    console.error('Publishing error:', error);
    setUploadError(error.message);
  } finally {
    setUploading(false);
  }
};







  return (
    <div 
      ref={backgroundRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        '--x': '0.5',
        '--y': '0.5',
        '--color-1': 'rgba(94, 99, 229, 0.85)',
        '--color-2': 'rgba(145, 35, 248, 0.83)',
        '--color-3': 'rgba(7, 85, 137, 0.87)',
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
              linear-gradient(to bottom right,rgb(43, 219, 208),rgb(4, 79, 89))
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

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-2 shadow-md flex justify-between items-center h-14">
        <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md text-xs">
          DM
        </div>
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1 text-white"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen pt-14 md:pt-0">
        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div className="md:hidden w-full bg-gray-900 text-white shadow-lg z-40 fixed top-14 bottom-0 overflow-y-auto">
            <AdminSidebar 
              isSidebarOpen={true}
              setIsSidebarOpen={setIsSidebarOpen}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mobileView={true}
            />
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen && !mobileView ? 'md:ml-64' : 'md:ml-20'} ${mobileSidebarOpen ? 'mt-14' : ''}`}>
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
            removeCoverPhoto={removeCoverPhoto}
            videoPreview={videoPreview}
            setVideoPreview={setVideoPreview}
            addNewClass={addNewClass}
            handlePublish={handlePublish}
            courseDescription={courseDescription}
            setCourseDescription={setCourseDescription}
            showSuccessModal={showSuccessModal}
            setShowSuccessModal={setShowSuccessModal}

          />
        </div>
      </div>
    </div>
  );
};

export default Admin;