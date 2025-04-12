import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Icons for password toggle

// Background Image
const bgImage = new URL("/src/assets/bg_img/Bglogin1.jpg", import.meta.url).href;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        res.data.role === "admin" ? navigate("/admin-dashboard") : navigate("/user-dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 relative z-10 border border-white border-opacity-30">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Toggle Button */}
          <div className="relative">
            <label className="block text-white">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 pr-10 border border-white border-opacity-30 bg-transparent text-white placeholder-gray-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-white hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>

          <div className="flex flex-col items-center text-sm mt-4 space-y-2">
            <Link to="/forgot-password" className="text-blue-200 hover:text-blue-100 transition duration-200">
              Forgot Password?
            </Link>

            <div className="flex items-center gap-1">
              <span className="text-white">Don't have an account?</span>
              <Link to="/signup" className="text-blue-200 hover:text-blue-100 transition duration-200 font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
