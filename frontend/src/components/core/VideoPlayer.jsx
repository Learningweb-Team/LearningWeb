// src/components/VideoPlayer.jsx
import React from 'react';

const VideoPlayer = ({ videoUrl, isAdmin }) => {
  return (
    <div className="mb-8">
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        {videoUrl ? (
          <video
            controls
            className="w-full"
            autoPlay={isAdmin} // Autoplay for admin preview
            controlsList={isAdmin ? "nodownload" : ""} // Disable download for admin
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            No video selected
          </div>
        )}
      </div>
      
      {!isAdmin && (
        <div className="mt-4 flex justify-between items-center">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Mark as Completed
          </button>
          <span className="text-sm text-gray-600">3/10 videos completed</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;