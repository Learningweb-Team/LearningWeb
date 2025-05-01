import React, { useState } from 'react';
import { FiPlus, FiUpload, FiVideo, FiFileText, FiX, FiCheck, FiImage } from 'react-icons/fi';

const ModuleSection = ({ 
  module, 
  setModules,
  uploading,
  fileInputRef,
  uploadProgress,
  uploadError,
  successMessage,
  handleVideoUpload,
  removeVideo,
  onUploadToCourses, // New prop for handling the upload to courses
  coverPhoto, // Moved to props to manage at parent level
  setCoverPhoto // Moved to props to manage at parent level
}) => {

  // Add new class to module
  const addNewClass = (moduleId) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId ? {
          ...module,
          classes: [
            ...module.classes,
            {
              id: Date.now(),
              title: 'New Lecture',
              week: 'Week ' + (module.classes.length + 1),
              description: '',
              videoUrl: '',
              publicId: ''
            }
          ]
        } : module
      )
    );
  };

  // Add new assignment to module
  const addNewAssignment = (moduleId) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId ? {
          ...module,
          assignments: [
            ...module.assignments,
            {
              id: Date.now(),
              title: 'New Assignment'
            }
          ]
        } : module
      )
    );
  };

  // Handle class title change
  const handleClassChange = (moduleId, classId, field, value) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId ? {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId ? { ...cls, [field]: value } : cls
          )
        } : module
      )
    );
  };

  // Handle assignment title change
  const handleAssignmentChange = (moduleId, assignmentId, value) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId ? {
          ...module,
          assignments: module.assignments.map(assignment => 
            assignment.id === assignmentId ? { ...assignment, title: value } : assignment
          )
        } : module
      )
    );
  };

  // Handle cover photo upload
  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Remove cover photo
  const removeCoverPhoto = () => setCoverPhoto(null);

  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Cover Photo Section */}
      <div className="p-6 border-b border-gray-200">
        <label className="block text-gray-700 font-semibold mb-2">Cover Photo</label>
        {coverPhoto ? (
          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            <button 
              onClick={removeCoverPhoto} 
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <label className="flex items-center text-blue-500 hover:text-blue-700 cursor-pointer transition-colors mb-4">
            <FiUpload className="mr-2" /> Upload Cover Photo
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleCoverPhotoUpload} 
            /> 
          </label>
        )}
      </div>

      {/* Module Title and Description */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="text-lg font-semibold bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors flex-1 mr-4"
            value={module.title}
            onChange={(e) => 
              setModules(prevModules => 
                prevModules.map(m => 
                  m.id === module.id ? {...m, title: e.target.value} : m
                )
              )
            }
            placeholder="Module title"
            required
          />
          <div className="flex space-x-2">
            <button 
              className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors"
              onClick={() => addNewClass(module.id)}
              disabled={uploading}
            >
              <FiPlus className="mr-1" /> Add Lecture
            </button>
            <button 
              className="flex items-center text-sm text-green-500 hover:text-green-700 transition-colors"
              onClick={() => addNewAssignment(module.id)}
              disabled={uploading}
            >
              <FiPlus className="mr-1" /> Add Assignment
            </button>
          </div>
        </div>
        
        <textarea
          className="w-full mt-3 p-2 border rounded text-gray-700 text-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          value={module.description}
          onChange={(e) => 
            setModules(prevModules => 
              prevModules.map(m => 
                m.id === module.id ? {...m, description: e.target.value} : m
              )
            )
          }
          placeholder="Module description"
          rows="3"
          required
        />
      </div>

      {/* Classes List */}
      <div className="divide-y divide-gray-200">
        {module.classes.map(cls => (
          <div key={cls.id} className="p-6 hover:bg-gray-50 transition-colors group">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <input
                    type="text"
                    className="font-medium bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none mr-2 transition-colors flex-1"
                    value={cls.title}
                    onChange={(e) => handleClassChange(module.id, cls.id, 'title', e.target.value)}
                    placeholder="Lecture title"
                  />
                  <input
                    type="text"
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded transition-colors w-20"
                    value={cls.week}
                    onChange={(e) => handleClassChange(module.id, cls.id, 'week', e.target.value)}
                    placeholder="Week"
                  />
                </div>
                
                <input
                  type="text"
                  className="w-full text-sm text-gray-600 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors mt-1"
                  value={cls.description}
                  onChange={(e) => handleClassChange(module.id, cls.id, 'description', e.target.value)}
                  placeholder="Lecture description"
                />
                
                <div className="mt-3">
                  {cls.videoUrl ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FiCheck className="text-green-500 mr-2" />
                        <span className="text-sm text-green-700">Video uploaded</span>
                      </div>
                      <div className="flex space-x-2">
                        <a 
                          href={cls.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                        >
                          <FiVideo className="mr-1" /> View
                        </a>
                        <button 
                          onClick={() => removeVideo(module.id, cls.id)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
                        >
                          <FiX className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className={`flex items-center text-sm ${uploading ? 'text-gray-500' : 'text-blue-500 hover:text-blue-700'} cursor-pointer transition-colors mb-2`}>
                        <FiUpload className="mr-1" />
                        {uploading ? 'Uploading...' : 'Upload Video'}
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          className="hidden" 
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(module.id, cls.id, e)}
                          disabled={uploading}
                        />
                      </label>
                      
                      {uploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {uploadError && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 rounded flex items-center">
                          <FiX className="mr-1" /> {uploadError}
                        </div>
                      )}
                      
                      {successMessage && (
                        <div className="text-green-500 text-sm p-2 bg-green-50 rounded flex items-center">
                          <FiCheck className="mr-1" /> {successMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignments Section */}
      {module.assignments.length > 0 && (
        <div className="bg-gray-50 p-6 border-t border-gray-200 transition-colors">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Assignments
            </h4>
          </div>
          <div className="space-y-3">
            {module.assignments.map(assignment => (
              <div 
                key={assignment.id} 
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
              >
                <input
                  type="text"
                  className="flex-1 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                  value={assignment.title}
                  onChange={(e) => handleAssignmentChange(module.id, assignment.id, e.target.value)}
                  placeholder="Assignment title"
                />
                <label className="ml-3 flex items-center text-sm text-blue-500 hover:text-blue-700 cursor-pointer transition-colors">
                  <FiUpload className="mr-1" />
                  Files
                  <input type="file" className="hidden" multiple />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload to Courses Button */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => onUploadToCourses(module.id)}
          disabled={uploading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload to Courses'}
        </button>
      </div>
    </div>
  );
};

export default ModuleSection;