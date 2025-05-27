import axios from "axios";

const API_BASE_URL = "https://digital-schools-backend.onrender.com/api"; // Backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to every request (if user is logged in)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from local storage
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
