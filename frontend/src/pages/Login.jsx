import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Boxes } from "../components/Boxes";
import { Eye, EyeOff } from "lucide-react";
import DigitalSchoolLoader from "../components/DigitalSchoolLoader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);


  
    try {
      const res = await axios.post("https://digital-schools-backend.onrender.com/api/auth/login", { email, password });
 

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      // Keep loading true until navigation completes
      res.data.role === "admin" 
        ? navigate("/admin-dashboard", { replace: true }) 
        : navigate("/user-dashboard", { replace: true });
    }
  } catch (error) {
    setError(error.response?.data?.message || "Login failed");
    setIsLoading(false);
  }
};
  if (isLoading) {
    return <DigitalSchoolLoader />;
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <Boxes className="absolute inset-0 opacity-20" />
      
      <div className="relative z-10 bg-gray-800/80 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white">Email:</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-white">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 pr-10 border border-gray-600 bg-gray-700 text-white rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-9 text-gray-400 hover:text-white"
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
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition duration-200">
              Forgot Password?
            </Link>

            <div className="flex items-center gap-1">
              <span className="text-gray-300">Don't have an account?</span>
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition duration-200 font-medium">
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