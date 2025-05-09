import React from 'react';

const CourseProgress = ({ progress, courseId }) => {
  // Calculate completion stats
  const completedCount = progress.completedVideos?.length || 0;
  const totalCount = progress.totalVideos || 1; // Avoid division by zero
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Progress Details */}
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">{completedCount}</span> of{' '}
          <span className="font-medium">{totalCount}</span> videos completed
        </p>
        <p className="text-gray-600">
          Overall completion: <span className="font-medium">{percentage}%</span>
        </p>
        
        {/* Last Watched */}
        {progress.lastWatchedVideo && (
          <p className="text-sm text-gray-500">
            Last watched: {progress.lastWatchedVideo.title || 'Video'} at{' '}
            {formatTime(progress.lastWatchedVideo.timestamp || 0)}
          </p>
        )}
      </div>
    </div>
  );
};

// Helper function to format time (mm:ss)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default CourseProgress;