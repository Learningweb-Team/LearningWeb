import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import bgImage from "/src/assets/bg_img/Bglogin1.jpg";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "", // Changed to match backend
    password: "",
    image: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const uploadImage = async (file) => {
    // In a real app, implement actual image upload logic here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://example.com/user-uploaded-image.jpg");
      }, 1000);
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let imageUrl = "";
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        image: imageUrl || "",
        
      };

      const res = await axios.post("http://localhost:5000/api/auth/signup", userData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setSuccess("Account created successfully! Redirecting...");

        setTimeout(() => {
          navigate(res.data.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
        }, 1500);
      } else {
        setError(res.data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (error.response?.data?.error?.message || "Signup failed. Please try again.");
      setError(errorMessage);
      console.error("Signup Error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md relative z-10 border border-white border-opacity-30">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Create Account</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {success && <p className="text-green-400 text-center mb-4">{success}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm mb-1">First Name*</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-1">Last Name*</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Email*</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Phone Number*</label>
            <input
              type="tel"
              name="phoneNumber"
              className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded"
              placeholder="e.g. +91 9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-white text-sm mb-1">Password*</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Profile Image</label>
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="flex-1">
                <span className="block w-full p-2 text-center text-sm text-white border border-white border-opacity-30 rounded hover:bg-white hover:bg-opacity-10 transition cursor-pointer">
                  {selectedImage ? "Change Image" : "Upload Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Account...
              </>
            ) : "Sign Up"}
          </button>

          <div className="flex justify-center text-sm mt-4 text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-200 hover:text-blue-100 ml-1 font-medium">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;