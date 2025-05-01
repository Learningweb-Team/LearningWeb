import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // For admin, we'll use the admin profile endpoint
        const role = localStorage.getItem("role");
        const endpoint = role === "admin" 
          ? "http://localhost:5000/api/dashboard/admin/profile" 
          : "http://localhost:5000/api/profile";
        
        const response = await fetch(endpoint, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(role === "admin" ? data.admin : data.user);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setError("Failed to load profile.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!user) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Only shown for admin */}
      {user.role === "admin" && (
        <div className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-8">The Digital School</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">MY DASHBOARD</h2>
            <ul className="space-y-2">
              <li><Link to="/dashboard/courses" className="block hover:bg-gray-700 p-2 rounded">Courses</Link></li>
              <li><Link to="/dashboard/students" className="block hover:bg-gray-700 p-2 rounded">Students</Link></li>
              <li><Link to="/dashboard/analytics" className="block hover:bg-gray-700 p-2 rounded">Analytics</Link></li>
              <li><Link to="/dashboard/messages" className="block hover:bg-gray-700 p-2 rounded">Messages</Link></li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">COURSE MANAGEMENT</h2>
            <ul className="space-y-2">
              <li><Link to="/dashboard/courses/all" className="block hover:bg-gray-700 p-2 rounded">All Courses</Link></li>
              <li><Link to="/dashboard/schedule" className="block hover:bg-gray-700 p-2 rounded">Schedule</Link></li>
            </ul>
          </div>

          <div>
            <Link 
              to="/login" 
              onClick={() => localStorage.removeItem("token")}
              className="block hover:bg-gray-700 p-2 rounded"
            >
              Logout
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {/* Show course info only for admin */}
        {user.role === "admin" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Digital Marketing Masterclass</h1>
            <p className="mb-8">Create different lessons under sections for your digital marketing course</p>
          </>
        )}
        
        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-bold mb-6">My Profile</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;