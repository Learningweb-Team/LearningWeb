import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found, redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/admin/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("🔍 API Response:", data);

        if (!response.ok || !data.admin) {
          throw new Error(data.message || "Failed to fetch admin details");
        }

        if (data.admin.role !== "admin") {
          console.warn("⚠️ Not an admin, redirecting...");
          navigate("/login");
        } else {
          setAdmin(data.admin);
        }
      } catch (err) {
        console.error("❌ Error fetching admin profile:", err.message);
        setError("Failed to load admin details.");
        navigate("/login");
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;
  if (!admin) return <p className="text-center mt-6">Loading admin details...</p>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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

      {/* Main Content - Focused on Profile */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Digital Marketing Masterclass</h1>
        <p className="mb-8">Create different lessons under sections for your digital marketing course</p>
        
        {/* Profile Section - Simplified to match screenshot */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-xl font-bold mb-6">My Profile</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{admin.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{admin.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg">{admin.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;