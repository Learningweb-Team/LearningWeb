import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CourseDetail from './pages/CourseDetail';
import UserDashboard from "./pages/UserDashboard";
import Courses from "./pages/Courses";
import Admin from "./components/admin"; // Updated import path
import AdminProfile from "./pages/AdminProfile";
import MyCourses from "./components/core/MyCourses";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Convert allowedRoles to array if it's not already
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  if (!rolesArray.map(role => role.toLowerCase()).includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/my-courses" element={<MyCourses />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          
       


          {/* User Routes */}
          <Route
            path="/user-dashboard/*"
            element={
              <ProtectedRoute allowedRoles="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Dashboard (if separate from main admin interface) */}
          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute allowedRoles="admin">
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ConditionalFooter />
    </Router>
  );
}

const ConditionalFooter = () => {
  const location = useLocation();
  const hideFooterRoutes = [
    "/login", 
    "/signup", 
    "/admin",
    "/admin/*",
    "/user-dashboard",
    "/forgot-password",
    "/reset-password"
  ];

  const shouldHideFooter = hideFooterRoutes.some(route => {
    if (route.endsWith('/*')) {
      const baseRoute = route.replace('/*', '');
      return location.pathname.startsWith(baseRoute);
    }
    return location.pathname === route;
  });

  return !shouldHideFooter ? <Footer /> : null;
};

export default App;