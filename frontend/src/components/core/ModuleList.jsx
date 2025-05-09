// src/components/ModuleList.jsx
import React from 'react';

const ModuleList = ({ 
  modules = [], 
  onVideoSelect, 
  onModuleComplete,
  userProgress = { completedModules: [] }, 
  isAdmin 
}) => {
  const handleModuleComplete = (moduleId) => {
    // Check if all videos in module are watched
    const module = modules.find(m => m._id === moduleId);
    if (module) {
      const allVideosWatched = module.classes.every(cls => 
        userProgress.completedVideos?.includes(cls._id)
      );
      if (allVideosWatched) {
        onModuleComplete(moduleId);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
      <div className="space-y-4">
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules available</p>
        ) : (
          modules.map((module) => (
            <div key={module._id || Math.random()} className="border-b pb-4">
              <h4 className="font-medium text-lg mb-2">{module.title || 'Untitled Module'}</h4>
              {module.classes && module.classes.length > 0 ? (
                <ul className="space-y-2">
                  {module.classes.map((cls) => (
                    <li 
                      key={cls._id || Math.random()}
                      className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                        userProgress.completedVideos?.includes(cls._id) ? 'bg-green-50' : ''
                      }`}
                      onClick={() => onVideoSelect(cls)}
                    >
                      <div className="flex items-center">
                        {!isAdmin && (
                          <span className="mr-2">
                            {userProgress.completedVideos?.includes(cls._id) ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-gray-400">○</span>
                            )}
                          </span>
                        )}
                        <span>{cls.title || 'Untitled Class'}</span>
                        {isAdmin && (
                          <button 
                            className="ml-auto text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit video handler
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No classes in this module</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleList;