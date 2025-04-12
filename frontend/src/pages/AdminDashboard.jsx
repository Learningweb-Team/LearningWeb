import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState(""); // Track errors
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
        console.log("🔍 API Response:", data); // Debugging

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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Admin Profile</h1>
      <div className="border p-4 rounded-md max-w-md mx-auto">
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Role:</strong> {admin.role}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
