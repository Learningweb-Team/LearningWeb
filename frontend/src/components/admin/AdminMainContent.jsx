import React, { useState } from 'react';
import { Upload, Video, Image, Plus, Trash2, Check, X, Eye, Edit } from 'lucide-react';

const AdminMainContent = ({
  courseTitle,
  setCourseTitle,
  modules,
  setModules,
  activeModuleId,
  setActiveModuleId,
  handleVideoUpload,
  removeVideo,
  onUploadToCourses,
  coverPhoto,
  setCoverPhoto,
  removeCoverPhoto
}) => {
  const [videoPreview, setVideoPreview] = useState(null);
  const activeModule = modules.find(module => module.id === activeModuleId);

  // Toggle lesson description editing
  const toggleEditDescription = (moduleId, classId) => {
    setModules(modules.map(module => 
      module.id === moduleId
        ? {
            ...module,
            classes: module.classes.map(cls => 
              cls.id === classId 
                ? { ...cls, isEditing: !cls.isEditing } 
                : cls
            )
          }
        : module
    ));
  };

  // Update lesson description
  const updateDescription = (moduleId, classId, newDesc) => {
    setModules(modules.map(module => 
      module.id === moduleId
        ? {
            ...module,
            classes: module.classes.map(cls => 
              cls.id === classId 
                ? { ...cls, description: newDesc } 
                : cls
            )
          }
        : module
    ));
  };

  // View video
  const handleViewVideo = (videoUrl) => {
    setVideoPreview(videoUrl);
  };

  // Add new module
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

  // Add new class/lesson
  const addNewClass = () => {
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
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      {/* Course Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          {courseTitle}
        </h1>
        <p className="text-gray-600 text-center">
          Create different lessons under sections for your digital marketing course.
        </p>
      </div>

      {/* Cover Photo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cover Photo</h2>
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg overflow-hidden">
          {coverPhoto || activeModule?.coverPhotoUrl ? (
            <>
              <img 
                src={coverPhoto || activeModule.coverPhotoUrl} 
                alt="Course cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={removeCoverPhoto}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Image size={32} className="mb-2" />
                <span className="text-sm">Upload Cover Photo</span>
              </div>
              <input
                type="file"
                onChange={setCoverPhoto}
                accept="image/*"
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Module Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeModuleId === module.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {module.title.split(':')[0]}
            </button>
          ))}
          <button
            onClick={addNewModule}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Module
          </button>
        </div>
      </div>

      {/* Current Module */}
      {activeModule && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{activeModule.title}</h2>
            <p className="text-gray-600 mt-2">{activeModule.description}</p>
          </div>

          {/* Lessons */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Lessons</h3>
              <button
                onClick={addNewClass}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 transition-colors flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add Lesson
              </button>
            </div>

            {activeModule.classes.length > 0 ? (
              <div className="space-y-4">
                {activeModule.classes.map(cls => (
                  <div key={cls.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{cls.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {cls.week}
                      </span>
                    </div>
                    
                    {/* Editable Description */}
                    {cls.isEditing ? (
                      <textarea
                        value={cls.description}
                        onChange={(e) => updateDescription(activeModule.id, cls.id, e.target.value)}
                        className="w-full p-2 mb-3 border rounded text-sm text-gray-600"
                        rows="3"
                        autoFocus
                        onBlur={() => toggleEditDescription(activeModule.id, cls.id)}
                      />
                    ) : (
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm text-gray-600">{cls.description}</p>
                        <button 
                          onClick={() => toggleEditDescription(activeModule.id, cls.id)}
                          className="text-blue-500 hover:text-blue-700 ml-2"
                          title="Edit description"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      {cls.videoUrl ? (
                        <>
                          <Video size={16} className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-600 mr-4">Video uploaded</span>
                          <button 
                            onClick={() => handleViewVideo(cls.videoUrl)}
                            className="text-blue-500 hover:text-blue-700 text-sm flex items-center mr-4"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => removeVideo(activeModule.id, cls.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center">
                          <Upload size={14} className="mr-1" />
                          Upload Video
                          <input
                            type="file"
                            onChange={(e) => handleVideoUpload(activeModule.id, cls.id, e)}
                            accept="video/*"
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No lessons added yet</p>
              </div>
            )}
          </div>

          {/* Assignments */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Assignments</h3>
            {activeModule.assignments.length > 0 ? (
              <div className="space-y-2">
                {activeModule.assignments.map(assignment => (
                  <div key={assignment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-200 mr-3"></span>
                      <span className="text-gray-800">{assignment.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No assignments yet</p>
            )}
          </div>
        </div>
      )}

      {/* Publish Button */}
      <div className="flex justify-center">
        <button
          onClick={onUploadToCourses}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Publish Changes
        </button>
      </div>

      {/* Video Preview Modal */}
      {videoPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Video Preview</h3>
              <button 
                onClick={() => setVideoPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <video controls className="w-full rounded">
              <source src={videoPreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMainContent;