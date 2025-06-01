import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Boxes } from "../components/Boxes";
import PhoneNumberInput from "../components/common/PhoneNumberInput";
import DigitalSchoolLoader from "../components/DigitalSchoolLoader";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (fullPhoneNumber) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: fullPhoneNumber,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      };

      const res = await axios.post(
        "https://digital-schools-backend.onrender.com/api/auth/signup",
        userData
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setSuccess("Account created successfully! Redirecting...");

        setTimeout(() => {
          navigate(res.data.role === "admin" ? "/admin-dashboard" : "/user-dashboard", { replace: true });
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.message ||
        "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DigitalSchoolLoader />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 px-4 py-8">
      <Boxes className="absolute inset-0 opacity-20" />

      <div className="relative z-10 bg-gray-800/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
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
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
                placeholder="First name"
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
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
                placeholder="Last name"
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
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <PhoneNumberInput
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
            defaultCountry="IN"
          />

          <div className="relative">
            <label className="block text-white text-sm mb-1">Password*</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-white text-sm mb-1">Confirm Password*</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="flex justify-center text-sm mt-4 text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;