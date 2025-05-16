import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VideoPlayer = ({ 
  videoUrl, 
  videoId, 
  courseId, 
  isAdmin, 
  onVideoComplete
}) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const token = localStorage.getItem('token');

  const updateWatchProgress = async (currentTime) => {
    if (!token || isTracking) return;
    
    setIsTracking(true);
    try {
      await axios.put(
        `http://localhost:5000/api/progress/${courseId}/watch`,
        { 
          videoId,
          timestamp: currentTime 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating watch progress:', error);
    } finally {
      setIsTracking(false);
    }
  };

  const markAsCompleted = async () => {
    if (!token || isCompleted) return;
    
    try {
      await axios.post(
        `http://localhost:5000/api/progress/${courseId}/complete`,
        { videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsCompleted(true);
      if (onVideoComplete) onVideoComplete(videoId);
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  };

  useEffect(() => {
    if (!token || isAdmin) return;
    
    const checkCompletion = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/progress/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const progressData = response.data.data || response.data;
        setIsCompleted(progressData.completedVideos?.includes(videoId) || false);
      } catch (error) {
        console.error('Error checking completion:', error);
      }
    };
    
    checkCompletion();
  }, [videoId, courseId, token, isAdmin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);

      if (currentProgress >= 100 && !isCompleted) {
        markAsCompleted();
      }

      updateWatchProgress(video.currentTime);
    };

    const handleEnded = () => {
      if (onVideoComplete) onVideoComplete(videoId);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, isCompleted, isAdmin, onVideoComplete, videoId]);

  return (
    <div className="mb-8">
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
        {videoUrl ? (
          <video
            ref={videoRef}
            controls
            className="w-full"
            playsInline
            controlsList={isAdmin ? "nodownload" : ""}
            key={videoId}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser doesn't support HTML5 video.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            No video selected
          </div>
        )}
      </div>
      
      {!isAdmin && (
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={markAsCompleted}
            disabled={isCompleted}
            className={`px-4 py-2 rounded ${
              isCompleted 
                ? 'bg-green-100 text-green-800 cursor-default' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isCompleted ? '✓ Completed' : 'Mark as Completed'}
          </button>
          <div className="text-sm text-gray-600">
            <span>Watched: {Math.round(progress)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;