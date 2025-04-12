import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/otp/send-otp", { email });
      setMessage(res.data.message);
      setShowOtpField(true); // Show OTP input field
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify-otp", { email, otp });
      setMessage(res.data.message);
      setVerified(true);
      navigate("/change-password", { state: { email } }); // Redirect to Change Password page
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        
        {!showOtpField ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Verify OTP
            </button>
          </form>
        )}

        {message && <p className="text-red-500 mt-2 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
