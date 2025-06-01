import React, { useState } from 'react';
import { Upload, Video, Image, Plus, Trash2, X, Eye, Edit, Check } from 'lucide-react';

const AdminMainContent = ({
  courseTitle,
  setCourseTitle,
  courseDescription,           // Added prop
  setCourseDescription,        // Added prop
  modules,
  setModules,
  activeModuleId,
  setActiveModuleId,
  handleVideoUpload,
  removeVideo,
  onUploadToCourses,
  coverPhoto,
  setCoverPhoto,
  removeCoverPhoto,
  showSuccessModal,
  setShowSuccessModal,
  uploading,
  uploadError,
  handlePublish,
  successMessage
  
}) => {
  const [videoPreview, setVideoPreview] = useState(null);
  
  const [editingCourseTitle, setEditingCourseTitle] = useState(false);
  const [tempCourseTitle, setTempCourseTitle] = useState(courseTitle);
  const [editingCourseDescription, setEditingCourseDescription] = useState(false);
  const [tempCourseDescription, setTempCourseDescription] = useState(courseDescription || '');
  
  const activeModule = modules.find(module => module.id === activeModuleId);



  
  // Update course description
  const updateCourseDescription = () => {
    setCourseDescription(tempCourseDescription);
    setEditingCourseDescription(false);
  };

  // Handle publish with description
  const handlePublishWithDescription = () => {
    console.log('Publishing with description:', courseDescription);
    handlePublish({
      title: courseTitle,
      description: courseDescription,
      coverPhoto,
      modules
    });
  };

  // Toggle edit mode for various fields
  const toggleEdit = (field, moduleId = null, classId = null, assignmentId = null) => {
    if (field === 'courseTitle') {
      setEditingCourseTitle(!editingCourseTitle);
      if (editingCourseTitle) {
        setCourseTitle(tempCourseTitle);
      }
      return;
    }

    if (field === 'courseDescription') {
      setEditingCourseDescription(!editingCourseDescription);
      if (editingCourseDescription) {
        setCourseDescription(tempCourseDescription);
      }
      return;
    }

    setModules(modules.map(module => {
      if (moduleId && module.id !== moduleId) return module;
      
      if (field === 'moduleTitle') {
        return {
          ...module,
          editingTitle: !module.editingTitle,
          tempTitle: module.editingTitle ? module.tempTitle : module.title
        };
      }
      
      if (field === 'moduleDescription') {
        return {
          ...module,
          editingDescription: !module.editingDescription,
          tempDescription: module.editingDescription ? module.tempDescription : module.description
        };
      }
      
      if (classId && field === 'classTitle') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId 
              ? { 
                  ...cls, 
                  editingTitle: !cls.editingTitle,
                  tempTitle: cls.editingTitle ? cls.tempTitle : cls.title
                } 
              : cls
          )
        };
      }
      
      if (classId && field === 'classDescription') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId 
              ? { 
                  ...cls, 
                  isEditing: !cls.isEditing,
                  tempDescription: cls.isEditing ? cls.tempDescription : cls.description
                } 
              : cls
          )
        };
      }
      
      if (assignmentId && field === 'assignmentTitle') {
        return {
          ...module,
          assignments: module.assignments.map(assignment => 
            assignment.id === assignmentId 
              ? { 
                  ...assignment, 
                  editing: !assignment.editing,
                  tempTitle: assignment.editing ? assignment.tempTitle : assignment.title
                } 
              : assignment
          )
        };
      }
      
      return module;
    }));
  };

  // Update field values
  const updateField = (field, value, moduleId = null, classId = null, assignmentId = null) => {
    if (field === 'courseTitle') {
      setTempCourseTitle(value);
      return;
    }

    if (field === 'courseDescription') {
      setTempCourseDescription(value);
      return;
    }

    setModules(modules.map(module => {
      if (moduleId && module.id !== moduleId) return module;
      
      if (field === 'moduleTitle') {
        return { ...module, tempTitle: value };
      }
      
      if (field === 'moduleDescription') {
        return { ...module, tempDescription: value };
      }
      
      if (classId && field === 'classTitle') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId ? { ...cls, tempTitle: value } : cls
          )
        };
      }
      
      if (classId && field === 'classDescription') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId ? { ...cls, tempDescription: value } : cls
          )
        };
      }
      
      if (assignmentId && field === 'assignmentTitle') {
        return {
          ...module,
          assignments: module.assignments.map(assignment => 
            assignment.id === assignmentId ? { ...assignment, tempTitle: value } : assignment
          )
        };
      }
      
      return module;
    }));
  };

  // Save changes for various fields
  const saveChanges = (field, moduleId = null, classId = null, assignmentId = null) => {
    if (field === 'courseTitle') {
      setCourseTitle(tempCourseTitle);
      setEditingCourseTitle(false);
      return;
    }

    if (field === 'courseDescription') {
      setCourseDescription(tempCourseDescription);
      setEditingCourseDescription(false);
      return;
    }

    setModules(modules.map(module => {
      if (moduleId && module.id !== moduleId) return module;
      
      if (field === 'moduleTitle') {
        return {
          ...module,
          title: module.tempTitle,
          editingTitle: false
        };
      }
      
      if (field === 'moduleDescription') {
        return {
          ...module,
          description: module.tempDescription,
          editingDescription: false
        };
      }
      
      if (classId && field === 'classTitle') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId 
              ? { ...cls, title: cls.tempTitle, editingTitle: false } 
              : cls
          )
        };
      }
      
      if (classId && field === 'classDescription') {
        return {
          ...module,
          classes: module.classes.map(cls => 
            cls.id === classId 
              ? { ...cls, description: cls.tempDescription, isEditing: false } 
              : cls
          )
        };
      }
      
      if (assignmentId && field === 'assignmentTitle') {
        return {
          ...module,
          assignments: module.assignments.map(assignment => 
            assignment.id === assignmentId 
              ? { ...assignment, title: assignment.tempTitle, editing: false } 
              : assignment
          )
        };
      }
      
      return module;
    }));
  };

  const handleViewVideo = (videoUrl) => {
    setVideoPreview(videoUrl);
  };

  const addNewModule = () => {
    const newModuleId = modules.length ? Math.max(...modules.map(m => m.id)) + 1 : 1;
    setModules([
      ...modules,
      {
        id: newModuleId,
        title: `Module ${newModuleId}: New Module`,
        tempTitle: `Module ${newModuleId}: New Module`,
        description: 'Module description',
        tempDescription: 'Module description',
        classes: [],
        assignments: [],
        coverPhotoUrl: '',
        coverPhotoPublicId: '',
        editingTitle: false,
        editingDescription: false
      }
    ]);
    setActiveModuleId(newModuleId);
  };

  const addNewClass = () => {
    if (!activeModule) return;

    const newClassId = activeModule.classes.length
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
                tempTitle: 'New Lesson',
                week: `Week ${module.classes.length + 1}`,
                description: 'Lesson description',
                tempDescription: 'Lesson description',
                videoUrl: '',
                publicId: '',
                isEditing: false,
                editingTitle: false
              }
            ]
          }
        : module
    ));
  };

  const addNewAssignment = () => {
    if (!activeModule) return;

    const newAssignmentId = activeModule.assignments.length
      ? Math.max(...activeModule.assignments.map(a => a.id)) + 1
      : 1;

    setModules(modules.map(module =>
      module.id === activeModuleId
        ? {
            ...module,
            assignments: [
              ...module.assignments,
              {
                id: newAssignmentId,
                title: 'New Assignment',
                tempTitle: 'New Assignment',
                editing: false
              }
            ]
          }
        : module
    ));
  };

  const removeAssignment = (moduleId, assignmentId) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            assignments: module.assignments.filter(a => a.id !== assignmentId)
          }
        : module
    ));
  };

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
      {/* Course Header */}
      <div className="bg-white rounded-xl p-6 shadow border">
        {editingCourseTitle ? (
          <div className="flex items-center mb-1">
            <input
              type="text"
              value={tempCourseTitle}
              onChange={(e) => updateField('courseTitle', e.target.value)}
              className="text-lg sm:text-2xl font-bold text-gray-800 flex-1 border-b-2 border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => saveChanges('courseTitle')}
              className="ml-2 p-1 text-green-500 hover:text-green-700"
            >
              <Check size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center mb-1">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{courseTitle}</h1>
            <button
              onClick={() => toggleEdit('courseTitle')}
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            >
              <Edit size={18} />
            </button>
          </div>
        )}
        
        <div className="flex items-start">
          {editingCourseDescription ? (
            <div className="flex-1">
              <textarea
                value={tempCourseDescription}
                onChange={(e) => updateField('courseDescription', e.target.value)}
                className="w-full p-2 border rounded text-gray-600"
                rows="3"
                autoFocus
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => setEditingCourseDescription(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCourseDescription}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 flex-1">{courseDescription || 'No description provided'}</p>
              <button
                onClick={() => setEditingCourseDescription(true)}
                className="ml-2 p-1 text-blue-500 hover:text-blue-700"
              >
                <Edit size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Cover Photo */}
      <div className="bg-white rounded-xl p-6 shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Cover Photo</h2>
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {coverPhoto ? (
            <>
              <img
                src={coverPhoto}
                alt="Course cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeCoverPhoto}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                title="Remove cover photo"
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center text-gray-500">
              <Image size={32} className="mb-2" />
              <span className="text-sm">Upload Cover Photo</span>
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
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 sm:gap-2 pb-1">
          {modules.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg whitespace-nowrap text-xs sm:text-base transition ${
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
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <Plus size={16} className="mr-1" />
            Add Module
          </button>
        </div>
      </div>

      {/* Active Module Details */}
      {activeModule && (
        <div className="bg-white rounded-xl p-6 shadow border space-y-6">
          {/* Module Title */}
          <div>
            {activeModule.editingTitle ? (
              <div className="flex items-center mb-1">
                <input
                  type="text"
                  value={activeModule.tempTitle}
                  onChange={(e) => updateField('moduleTitle', e.target.value, activeModule.id)}
                  className="text-xl font-semibold text-gray-800 flex-1 border-b-2 border-blue-500 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => saveChanges('moduleTitle', activeModule.id)}
                  className="ml-2 p-1 text-green-500 hover:text-green-700"
                >
                  <Check size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center mb-1">
                <h2 className="text-xl font-semibold text-gray-800">{activeModule.title}</h2>
                <button
                  onClick={() => toggleEdit('moduleTitle', activeModule.id)}
                  className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
              </div>
            )}
            
            {/* Module Description */}
            {activeModule.editingDescription ? (
              <div className="mb-3">
                <textarea
                  value={activeModule.tempDescription}
                  onChange={(e) => updateField('moduleDescription', e.target.value, activeModule.id)}
                  className="w-full p-2 border rounded text-gray-600"
                  rows="3"
                  autoFocus
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => saveChanges('moduleDescription', activeModule.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start mb-3">
                <p className="text-gray-600 flex-1">{activeModule.description}</p>
                <button
                  onClick={() => toggleEdit('moduleDescription', activeModule.id)}
                  className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Lessons */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Lessons</h3>
              <button
                onClick={addNewClass}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Lesson
              </button>
            </div>

            {activeModule.classes.length ? (
              <div className="space-y-4">
                {activeModule.classes.map(cls => (
                  <div key={cls.id} className="bg-gray-50 rounded-lg p-4 border">
                    {/* Class Title */}
                    <div className="flex justify-between items-start mb-2">
                      {cls.editingTitle ? (
                        <div className="flex items-center flex-1">
                          <input
                            type="text"
                            value={cls.tempTitle}
                            onChange={(e) => updateField('classTitle', e.target.value, activeModule.id, cls.id)}
                            className="font-medium text-gray-800 flex-1 border-b-2 border-blue-500 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveChanges('classTitle', activeModule.id, cls.id)}
                            className="ml-2 p-1 text-green-500 hover:text-green-700"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center flex-1">
                          <h4 className="font-medium text-gray-800">{cls.title}</h4>
                          <button
                            onClick={() => toggleEdit('classTitle', activeModule.id, cls.id)}
                            className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {cls.week}
                      </span>
                    </div>

                    {/* Class Description */}
                    {cls.isEditing ? (
                      <div className="mb-3">
                        <textarea
                          value={cls.tempDescription}
                          onChange={(e) => updateField('classDescription', e.target.value, activeModule.id, cls.id)}
                          className="w-full p-2 border rounded text-sm text-gray-600"
                          rows="3"
                          autoFocus
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => saveChanges('classDescription', activeModule.id, cls.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between mb-3">
                        <p className="text-sm text-gray-600">{cls.description}</p>
                        <button
                          onClick={() => toggleEdit('classDescription', activeModule.id, cls.id)}
                          className="text-blue-500 hover:text-blue-700 ml-2"
                          title="Edit description"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm">

{cls.videoFile ? (
  <div className="mt-2">
    <div className="flex items-center text-blue-500">
      <Video size={16} className="mr-1" />
      <span>Video ready for upload ({Math.round(cls.videoFile.size / 1024 / 1024)}MB)</span>
    </div>
    <button 
      onClick={() => {
        setModules(modules.map(m => 
          m.id === activeModuleId ? {
            ...m,
            classes: m.classes.map(c => 
              c.id === cls.id ? { ...c, videoFile: undefined } : c
            )
          } : m
        ));
      }}
      className="text-sm text-red-500 hover:text-red-700 mt-1 flex items-center"
    >
      <X size={14} className="mr-1" /> Remove
    </button>
  </div>
) : cls.videoUrl ? (
  <>
    <span className="flex items-center text-green-600"><Video size={16} className="mr-1" />Uploaded</span>
    <button onClick={() => handleViewVideo(cls.videoUrl)} className="text-blue-500 hover:text-blue-700 flex items-center">
      <Eye size={14} className="mr-1" />View
    </button>
    <button onClick={() => removeVideo(activeModule.id, cls.id)} className="text-red-500 hover:text-red-700 flex items-center">
      <Trash2 size={14} className="mr-1" />Remove
    </button>
  </>
) : (
  <label className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center">
    <Upload size={14} className="mr-1" />
    Upload Video
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setModules(modules.map(m => 
            m.id === activeModuleId ? {
              ...m,
              classes: m.classes.map(c => 
                c.id === cls.id ? { 
                  ...c, 
                  videoFile: e.target.files[0],
                  previewUrl: URL.createObjectURL(e.target.files[0])
                } : c
              )
            } : m
          ));
        }
      }}
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
              <p className="text-gray-500 text-center">No lessons added yet</p>
            )}
          </div>

          {/* Assignments */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Assignments</h3>
              <button
                onClick={addNewAssignment}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Assignment
              </button>
            </div>
            {activeModule.assignments.length ? (
              <div className="space-y-2">
                {activeModule.assignments.map(assignment => (
                  <div key={assignment.id} className="bg-gray-50 rounded-lg p-3 border flex items-center justify-between">
                    {assignment.editing ? (
                      <div className="flex items-center flex-1">
                        <input
                          type="text"
                          value={assignment.tempTitle}
                          onChange={(e) => updateField('assignmentTitle', e.target.value, activeModule.id, null, assignment.id)}
                          className="text-gray-800 flex-1 border-b-2 border-blue-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveChanges('assignmentTitle', activeModule.id, null, assignment.id)}
                          className="ml-2 p-1 text-green-500 hover:text-green-700"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center flex-1">
                        <span className="w-4 h-4 rounded-full bg-blue-200 mr-3" />
                        <span className="text-gray-800">{assignment.title}</span>
                        <button
                          onClick={() => toggleEdit('assignmentTitle', activeModule.id, null, assignment.id)}
                          className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => removeAssignment(activeModule.id, assignment.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
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
          onClick={handlePublishWithDescription}  // Changed to use the new publish handler
          disabled={uploading}
          className={`px-6 py-2 rounded-lg shadow ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {uploading ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {uploadError}
        </div>
      )}

      {/* Video Preview Modal */}
      {videoPreview && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Course Published Successfully!</h3>
            <p className="text-gray-600 mb-4">Your course has been uploaded and is now available to students.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Continue Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMainContent;