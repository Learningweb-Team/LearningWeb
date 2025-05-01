import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/dashboard/user-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUser(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">User Dashboard</h1>

      {user ? (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl text-blue-600 font-bold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-center">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-blue-600">{user.role}</p>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-500">Personal Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phoneNumber || "Not provided"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-500">Courses Enrolled</h3>
                  {user.courses && user.courses.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {user.courses.map((course, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 mt-2">No courses enrolled yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No user data available.</p>
      )}
    </div>
  );
};

export default UserDashboard;