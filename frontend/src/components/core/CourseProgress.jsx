// src/components/CourseProgress.jsx
import React from 'react';

const CourseProgress = ({ progress, courseId }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="bg-blue-600 h-4 rounded-full" 
          style={{ width: `${progress.percentage || 0}%` }}
        ></div>
      </div>
      <p className="text-gray-600">
        {progress.completedVideos || 0} of {progress.totalVideos || 0} videos completed
      </p>
    </div>
  );
};

export default CourseProgress;