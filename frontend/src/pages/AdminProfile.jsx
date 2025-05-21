// AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DigitalSchoolLoader from "../components/DigitalSchoolLoader";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch admin data");
        }

        setAdmin(data.admin);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) return <DigitalSchoolLoader />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Matching your screenshot */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-6">The Digital School</h1>
          <div className="text-gray-400 mb-1">{admin?.name || "Admin"}</div>
          <div className="text-sm text-gray-400 mb-6">{admin?.email || "admin@example.com"}</div>
        </div>

        <nav className="space-y-2">
          <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded font-medium">
            My Dashboard
          </Link>
          <Link to="/admin/courses" className="block hover:bg-gray-700 p-2 rounded">
            My Courses (0)
          </Link>
          <Link to="/admin/settings" className="block hover:bg-gray-700 p-2 rounded">
            Settings
          </Link>
          <Link to="/admin/management" className="block hover:bg-gray-700 p-2 rounded">
            Admin Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:bg-gray-700 p-2 rounded mt-4"
          >
            Sign out
          </button>
        </nav>
      </div>

      {/* Main Content - Profile Details */}
      <div className="flex-1 p-8 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-lg">{admin?.name || "Not available"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-lg">{admin?.email || "Not available"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-lg">{admin?.phone || "Not available"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="mt-1 text-lg capitalize">{admin?.role || "admin"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              <p className="mt-1 text-lg">
                {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;