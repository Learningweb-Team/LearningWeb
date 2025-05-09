// src/pages/CourseDetail.jsx
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
  const [userProgress, setUserProgress] = useState({ completedVideos: [] });
  const isAdmin = localStorage.getItem('role') === 'admin';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {}
        };
        
        // Add auth token if user is logged in (even if not admin)
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
          config
        );

        // Handle different response structures
        const courseData = response.data.data || response.data;
        console.log('Received course data:', courseData);
        
        if (!courseData) {
          throw new Error('Course data not found in response');
        }

        setCourse(courseData);
        
        // Fetch progress for non-admin users
        if (!isAdmin && token) {
          try {
            const progressResponse = await axios.get(
              `http://localhost:5000/api/progress/${courseId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserProgress(progressResponse.data.data || progressResponse.data || {});
          } catch (progressError) {
            console.log('Progress fetch error, using empty progress', progressError);
            setUserProgress({ completedVideos: [] });
          }
        }
      } catch (err) {
        console.error('Course fetch error:', err);
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'Failed to load course details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isAdmin]);

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
              isAdmin={isAdmin}
            />
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p>Select a video to start watching</p>
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
            onVideoSelect={setActiveVideo}
            userProgress={userProgress}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;