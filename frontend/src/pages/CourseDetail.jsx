import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/core/VideoPlayer';
import CourseProgress from '../components/core/CourseProgress';
import ModuleList from '../components/core/ModuleList';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState({ modules: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [userProgress, setUserProgress] = useState({ 
    completedVideos: [], 
    totalVideos: 0,
    lastWatchedVideo: null
  });

  const isAdmin = localStorage.getItem('role') === 'admin';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        setLoading(true);
        
        // Fetch course data
        const courseResponse = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
        );

        const courseData = courseResponse.data.data || courseResponse.data;
        setCourse(courseData);

        // Calculate total videos
        const totalVideos = courseData.modules?.reduce(
          (sum, module) => sum + (module.classes?.length || 0), 0
        );

        // Initialize progress with totalVideos
        setUserProgress(prev => ({
          ...prev,
          totalVideos
        }));

        // Fetch progress if user is logged in
        if (token && !isAdmin) {
          try {
            const progressResponse = await axios.get(
              `http://localhost:5000/api/progress/${courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const progressData = progressResponse.data.data || progressResponse.data || {};
            setUserProgress({
              ...progressData,
              totalVideos: progressData.totalVideos || totalVideos || 0
            });

            // Set last watched video if available
            if (progressData.lastWatchedVideo?.videoId) {
              const lastWatched = findVideoInCourse(
                courseData, 
                progressData.lastWatchedVideo.videoId
              );
              if (lastWatched) {
                setActiveVideo(lastWatched);
              }
            }
          } catch (progressError) {
            console.log('Progress fetch error, initializing new progress', progressError);
            // Initialize new progress record
            await axios.post(
              `http://localhost:5000/api/progress/${courseId}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserProgress({
              completedVideos: [],
              totalVideos,
              lastWatchedVideo: null
            });
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId, token, isAdmin]);

  const findVideoInCourse = (course, videoId) => {
    for (const module of course.modules || []) {
      for (const cls of module.classes || []) {
        if (cls._id === videoId) {
          return { ...cls, moduleId: module._id };
        }
      }
    }
    return null;
  };

  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    
    if (token && !isAdmin) {
      setUserProgress(prev => ({
        ...prev,
        lastWatchedVideo: {
          videoId: video._id,
          moduleId: video.moduleId,
          title: video.title,
          timestamp: 0
        }
      }));
    }
  };

  const handleModuleComplete = async (moduleId) => {
  if (!token || isAdmin) return;

  try {
    await axios.post(
      `http://localhost:5000/api/progress/${courseId}/complete-module`,
      { moduleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // Update local state
    setUserProgress(prev => ({
      ...prev,
      completedModules: [...new Set([...prev.completedModules, moduleId])]
    }));
  } catch (error) {
    console.error('Error marking module as completed:', error);
  }
};

  const handleVideoComplete = (videoId) => {
    if (!token || isAdmin) return;

    setUserProgress(prev => ({
      ...prev,
      completedVideos: [...new Set([...prev.completedVideos, videoId])]
    }));
  };

  if (loading) return <div className="text-center py-8">Loading course...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!course) return <div className="text-center py-8">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="mb-8">
        {course.coverPhotoUrl && (
          <img 
            src={course.coverPhotoUrl} 
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content - Video Player */}
        <div className="lg:w-2/3">
          {activeVideo ? (
            <VideoPlayer 
              videoUrl={activeVideo.videoUrl}
              videoId={activeVideo._id}
              courseId={courseId}
              isAdmin={isAdmin}
              onVideoComplete={handleVideoComplete}
            />
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p>{userProgress.lastWatchedVideo ? 
                'Continue watching your last video' : 
                'Select a video to start watching'}
              </p>
            </div>
          )}
          
          {!isAdmin && (
            <CourseProgress 
              progress={userProgress}
              courseId={courseId}
            />
          )}
        </div>

        {/* Sidebar - Modules */}
        <div className="lg:w-1/3">
        <ModuleList 
  modules={course.modules || []}
  onVideoSelect={handleVideoSelect}
  onModuleComplete={handleModuleComplete}
  userProgress={userProgress}
  isAdmin={isAdmin}
/>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
