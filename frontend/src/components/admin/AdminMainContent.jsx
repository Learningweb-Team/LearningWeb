import React from 'react';
import { FiPlus } from 'react-icons/fi';
import ModuleSection from './ModuleSection';

const AdminMainContent = ({ 
  courseTitle, 
  setCourseTitle, 
  modules, 
  setModules,
  uploading,
  fileInputRef,
  uploadProgress,
  uploadError,
  successMessage,
  handleVideoUpload,
  removeVideo
}) => {
  const addNewModule = () => {
    const newModule = {
      id: modules.length + 1,
      title: `Module ${modules.length + 1}`,
      description: '',
      classes: [],
      assignments: []
    };
    setModules([...modules, newModule]);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm transition-all hover:shadow-md">
        <input
          type="text"
          className="text-3xl font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pb-2 transition-colors"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Course title"
        />
        <p className="text-gray-600 mt-2">
          Create different lessons under sections for your digital marketing course
        </p>
      </div>

      {modules.map(module => (
        <ModuleSection
          key={module.id}
          module={module}
          modules={modules}
          setModules={setModules}
          uploading={uploading}
          fileInputRef={fileInputRef}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
          successMessage={successMessage}
          handleVideoUpload={handleVideoUpload}
          removeVideo={removeVideo}
        />
      ))}

      <button 
        onClick={addNewModule}
        disabled={uploading}
        className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlus className="mr-2" />
        Add New Module
      </button>
    </div>
  );
};

export default AdminMainContent;