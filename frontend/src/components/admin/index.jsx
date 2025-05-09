
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
  const [coverPhoto, setCoverPhoto] = useState({ file: null, url: '' });
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
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
    formData.append('resource_type', resourceType);

    if (resourceType === 'image' && moduleId) {
      formData.append('folder', `e-learning/courses/${courseTitle}/modules/${moduleId}/images`);
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
      return { url: data.secure_url, publicId: data.public_id };
    } catch (error) {
      setUploadError(error.message || 'Upload failed');
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

    if (activeModuleId) {
      setModules(prevModules => prevModules.map(module => 
        module.id === activeModuleId ? {
          ...module,
          coverPhotoFile: file,
          coverPhotoUrl: URL.createObjectURL(file)
        } : module
      ));
    } else {
      setCoverPhoto({
        file,
        url: URL.createObjectURL(file)
      });
    }
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

    // Validate course title
    if (!courseTitle.trim()) {
      throw new Error('Course title is required');
    }

    // Upload course cover photo
    let courseCoverPhoto = { url: '', publicId: '' };
    if (coverPhoto.file) {
      const result = await uploadToCloudinary(coverPhoto.file, 'image');
      if (result) {
        courseCoverPhoto = result;
      } else {
        throw new Error('Failed to upload course cover photo');
      }
    }

    // Upload all module content
    const updatedModules = await Promise.all(modules.map(async (module) => {
      // Validate module title
      if (!module.title.trim()) {
        throw new Error(`Module ${module.id} title is required`);
      }

      // Upload module cover photo
      let moduleCoverPhoto = { url: '', publicId: '' };
      if (module.coverPhotoFile) {
        const result = await uploadToCloudinary(module.coverPhotoFile, 'image', module.id);
        if (result) {
          moduleCoverPhoto = result;
        } else {
          throw new Error(`Failed to upload cover photo for module ${module.title}`);
        }
      }

      // Upload class videos and validate classes
      const updatedClasses = await Promise.all(module.classes.map(async (cls) => {
        if (!cls.title.trim()) {
          throw new Error(`Class title in module ${module.title} is required`);
        }

        if (cls.videoFile) {
          const result = await uploadToCloudinary(cls.videoFile, 'video', module.id);
          if (!result) {
            throw new Error(`Failed to upload video for class ${cls.title}`);
          }
          return {
            ...cls,
            videoUrl: result.url,
            publicId: result.publicId
          };
        }
        return cls;
      }));

      return {
        title: module.title,
        description: module.description,
        coverPhoto: moduleCoverPhoto,
        classes: updatedClasses,
        assignments: module.assignments || []
      };
    }));

    // Prepare final data
    const courseData = {
      title: courseTitle,
      description: "Course description", // You should add a description field in your UI
      coverPhoto: courseCoverPhoto,
      modules: updatedModules
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

    if (!response.ok) {
      throw new Error(data.message || 'Failed to publish course');
    }

    setSuccessMessage('Course published successfully!');
    // Optionally reset form or redirect
    // setCourseTitle('');
    // setModules([]);
    // setCoverPhoto({ file: null, url: '' });
  } catch (error) {
    console.error('Publishing error:', error);
    setUploadError(error.message);
  } finally {
    setUploading(false);
  }
};

  const addNewModule = () => {
    const newModuleId = modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1;
    setModules([
      ...modules,
      {
        id: newModuleId,
        title: `Module ${newModuleId}: New Module`,
        description: 'Module description',
        classes: [],
        assignments: [],
        coverPhotoUrl: '',
        coverPhotoPublicId: ''
      }
    ]);
    setActiveModuleId(newModuleId);
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
        {/* Sidebar */}
        <div className={`fixed md:relative z-20 h-full bg-white shadow-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">The Digital School</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1 rounded hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="font-medium text-gray-700 mb-4"></p>
              <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">MY DASHBOARD</h3>
              {['Courses', 'Students', 'Analytics', 'Messages'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`block w-full text-left py-5 px-5 rounded transition-colors ${activeTab === item ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            
            <div className="mt-auto">
              <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">COURSE MANAGEMENT</h3>
              {['All Courses', 'Schedule'].map(item => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`block w-full text-left py-2 px-3 rounded transition-colors ${activeTab === item ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  localStorage.removeItem('email');
                  window.location.href = '/login';
                }}
                className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mt-4"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

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
            removeCoverPhoto={removeCoverPhoto}
            videoPreview={videoPreview}
            setVideoPreview={setVideoPreview}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;