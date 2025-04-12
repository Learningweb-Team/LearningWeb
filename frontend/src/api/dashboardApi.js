import axiosInstance from "./axiosInstance";

// Get User Dashboard
export const getUserDashboard = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/user-dashboard");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get Admin Dashboard
export const getAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get("/dashboard/admin-dashboard");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const uploadMedia = async (formData) => {
  try {
    const response = await axiosInstance.post('/api/courses/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
// In dashboardApi.js
const response = await axiosInstance.post('/api/courses/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadProgress(percentCompleted);
  }
});