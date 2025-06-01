import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await axios.post("https://digital-schools-backend.onrender.com/api/otp/send-otp", { email });
      setMessage({ text: res.data.message, type: "success" });
      setStep(2);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Failed to send OTP", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await axios.post("https://digital-schools-backend.onrender.com/api/otp/verify-otp", { email, otp });
      setMessage({ text: res.data.message, type: "success" });
      setStep(3);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Invalid OTP", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords don't match", type: "error" });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const res = await axios.post("https://digital-schools-backend.onrender.com/api/otp/reset-password", { 
        email, 
        otp, 
        newPassword 
      });
      
      setMessage({ text: res.data.message, type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Failed to reset password", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Password Recovery</h2>
        
        {message.text && (
          <div 
            className={`p-3 mb-4 rounded ${message.type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="6-digit OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Check your email (including spam folder) for the OTP
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-2 text-blue-600 hover:text-blue-800 transition"
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
