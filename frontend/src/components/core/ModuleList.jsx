import React from 'react';
import { Edit } from 'lucide-react'; // Added import

const ModuleList = ({ 
  modules = [], 
  onVideoSelect, 
  onModuleComplete,
  userProgress = { completedModules: [], completedVideos: [] }, 
  isAdmin 
}) => {
  const handleModuleComplete = (moduleId) => {
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Course Modules</h3>
      <div className="space-y-6">
        {modules.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No modules available</p>
        ) : (
          modules.map((module) => (
            <div key={module._id || Math.random()} className="border-b border-gray-700 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg text-white">
                  {module.title || 'Untitled Module'}
                </h4>
                {!isAdmin && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    {module.classes?.filter(cls => 
                      userProgress.completedVideos?.includes(cls._id)).length || 0}/{module.classes?.length || 0}
                  </span>
                )}
              </div>
              
              {module.classes && module.classes.length > 0 ? (
                <ul className="space-y-3">
                  {module.classes.map((cls) => (
                    <li 
                      key={cls._id || Math.random()}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${
                        userProgress.completedVideos?.includes(cls._id) 
                          ? 'bg-green-900/30 border-l-4 border-green-500' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => onVideoSelect(cls)}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">
                          {userProgress.completedVideos?.includes(cls._id) ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-gray-400">○</span>
                          )}
                        </span>
                        <div className="flex-1">
                          <p className="text-white font-medium">{cls.title || 'Untitled Class'}</p>
                          {cls.description && (
                            <p className="text-gray-400 text-sm mt-1">{cls.description}</p>
                          )}
                        </div>
                        {isAdmin && (
                          <button 
                            className="ml-2 text-blue-400 hover:text-blue-300 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Edit video handler
                            }}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-gray-700/50 p-3 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">No lessons in this module</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuleList;