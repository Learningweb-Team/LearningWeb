import React, { useState, useEffect, useCallback } from 'react';
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
  const [videoQueue, setVideoQueue] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [userProgress, setUserProgress] = useState({ 
    completedVideos: [], 
    totalVideos: 0,
    lastWatchedVideo: null,
    isEnrolled: false
  });
  const [showNextVideoPrompt, setShowNextVideoPrompt] = useState(false);
  const [nextVideo, setNextVideo] = useState(null);

  const isAdmin = localStorage.getItem('role') === 'admin';
  const token = localStorage.getItem('token');

  // Get all videos in course in sequential order
  const getAllVideosInOrder = useCallback((course) => {
    const videos = [];
    course.modules?.forEach(module => {
      module.classes?.forEach(cls => {
        videos.push({
          ...cls,
          moduleId: module._id,
          moduleTitle: module.title
        });
      });
    });
    return videos;
  }, []);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update enrollment status
      setUserProgress(prev => ({
        ...prev,
        isEnrolled: true
      }));

      // Start with first video and autoplay
      if (videoQueue.length > 0) {
        const firstVideo = {
          ...videoQueue[0],
          shouldAutoplay: true
        };
        setActiveVideo(firstVideo);
        setCurrentVideoIndex(0);
        
        // Update last watched video in backend
        await axios.put(
          `http://localhost:5000/api/progress/${courseId}/watch`,
          { 
            videoId: firstVideo._id,
            timestamp: 0
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state
        setUserProgress(prev => ({
          ...prev,
          lastWatchedVideo: {
            videoId: firstVideo._id,
            moduleId: firstVideo.moduleId,
            title: firstVideo.title,
            timestamp: 0
          }
        }));
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setError(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  // Handle video completion
  const handleVideoComplete = async (videoId) => {
    if (!token || isAdmin) return;

    try {
      // Mark video as completed in backend
      await axios.post(
        `http://localhost:5000/api/progress/${courseId}/complete`,
        { videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        completedVideos: [...new Set([...prev.completedVideos, videoId])]
      }));

      // Check if there's a next video
      if (currentVideoIndex < videoQueue.length - 1) {
        const nextVideo = videoQueue[currentVideoIndex + 1];
        setNextVideo(nextVideo);
        setShowNextVideoPrompt(true);
      }
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  // Handle when user confirms to watch next video
  const handleConfirmNextVideo = async () => {
    const nextVideoToPlay = {
      ...nextVideo,
      shouldAutoplay: true
    };
    
    setActiveVideo(nextVideoToPlay);
    setCurrentVideoIndex(currentVideoIndex + 1);
    setShowNextVideoPrompt(false);
    setNextVideo(null);

    // Update last watched video in backend
    if (token && !isAdmin) {
      try {
        await axios.put(
          `http://localhost:5000/api/progress/${courseId}/watch`,
          { 
            videoId: nextVideo._id,
            timestamp: 0
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserProgress(prev => ({
          ...prev,
          lastWatchedVideo: {
            videoId: nextVideo._id,
            moduleId: nextVideo.moduleId,
            title: nextVideo.title,
            timestamp: 0
          }
        }));
      } catch (error) {
        console.error('Error updating watch progress:', error);
      }
    }
  };

  // Handle when user declines to watch next video
  const handleDeclineNextVideo = () => {
    setShowNextVideoPrompt(false);
    setNextVideo(null);
  };

  // Handle module completion
  const handleModuleComplete = async (moduleId) => {
    if (!token || isAdmin) return;

    try {
      await axios.post(
        `http://localhost:5000/api/progress/${courseId}/complete-module`,
        { moduleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUserProgress(prev => ({
        ...prev,
        completedModules: [...new Set([...prev.completedModules, moduleId])]
      }));
    } catch (error) {
      console.error('Error marking module as completed:', error);
    }
  };

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

        // Create video queue in order
        const allVideos = getAllVideosInOrder(courseData);
        setVideoQueue(allVideos);

        // Calculate total videos
        const totalVideos = allVideos.length;

        // Fetch progress if user is logged in
        if (token && !isAdmin) {
          try {
            // Check enrollment status with fallback
            let isEnrolled = false;
            let progressData = {};
            
            try {
              // First try the enrollment status endpoint
              const enrollStatus = await axios.get(
                `http://localhost:5000/api/users/enrollment-status/${courseId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              isEnrolled = enrollStatus.data?.isEnrolled || false;
              progressData = enrollStatus.data || {};
            } catch (error) {
              if (error.response?.status === 404) {
                // Fallback to progress check if endpoint not found
                const progressResponse = await axios.get(
                  `http://localhost:5000/api/progress/${courseId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                isEnrolled = !!progressResponse.data;
                progressData = progressResponse.data || {};
              } else {
                throw error;
              }
            }

            if (isEnrolled) {
              setUserProgress({
                ...progressData,
                totalVideos,
                isEnrolled: true
              });

              // Set initial video based on progress
              let initialVideo = null;
              let initialIndex = 0;

              if (progressData.lastWatchedVideo?.videoId) {
                const lastWatchedIndex = allVideos.findIndex(
                  v => v._id === progressData.lastWatchedVideo.videoId
                );
                if (lastWatchedIndex >= 0) {
                  initialVideo = {
                    ...allVideos[lastWatchedIndex],
                    shouldAutoplay: true
                  };
                  initialIndex = lastWatchedIndex;
                }
              }

              if (!initialVideo && allVideos.length > 0) {
                initialVideo = {
                  ...allVideos[0],
                  shouldAutoplay: true
                };
                initialIndex = 0;
              }

              setActiveVideo(initialVideo);
              setCurrentVideoIndex(initialIndex);
            } else {
              setUserProgress(prev => ({
                ...prev,
                totalVideos,
                isEnrolled: false
              }));
            }
          } catch (progressError) {
            console.log('Progress fetch error:', progressError);
            setUserProgress(prev => ({
              ...prev,
              totalVideos,
              isEnrolled: false
            }));
          }
        } else {
          // For non-logged in users or admins
          setUserProgress(prev => ({
            ...prev,
            totalVideos,
            isEnrolled: isAdmin
          }));
          
          if (isAdmin && allVideos.length > 0) {
            setActiveVideo({
              ...allVideos[0],
              shouldAutoplay: true
            });
            setCurrentVideoIndex(0);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId, token, isAdmin, getAllVideosInOrder]);

  const handleVideoSelect = (video) => {
    if (userProgress.isEnrolled || isAdmin) {
      const videoIndex = videoQueue.findIndex(v => v._id === video._id);
      
      // Check if all previous videos are completed (unless admin)
      const allPreviousCompleted = isAdmin || videoQueue.slice(0, videoIndex).every(v => 
        userProgress.completedVideos?.includes(v._id)
      );
      
      if (allPreviousCompleted) {
        setActiveVideo({
          ...video,
          shouldAutoplay: true
        });
        setCurrentVideoIndex(videoIndex);
        
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
      } else {
        alert('Please complete the previous videos before accessing this one.');
      }
    }
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
          {!userProgress.isEnrolled && !isAdmin ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Enroll to access this course</h3>
              <button
                onClick={handleEnroll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enroll Now
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          ) : activeVideo ? (
            <>
              <VideoPlayer 
                videoUrl={activeVideo.videoUrl}
                videoId={activeVideo._id}
                courseId={courseId}
                isAdmin={isAdmin}
                onVideoComplete={handleVideoComplete}
                shouldAutoplay={activeVideo.shouldAutoplay}
                key={activeVideo._id}
              />
              
              {showNextVideoPrompt && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Continue to next video: {nextVideo?.title}</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleConfirmNextVideo}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Yes, Continue
                    </button>
                    <button 
                      onClick={handleDeclineNextVideo}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      No, Stay Here
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p>No videos available in this course</p>
            </div>
          )}
          
          {!isAdmin && userProgress.isEnrolled && (
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
            isEnrolled={userProgress.isEnrolled || isAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;