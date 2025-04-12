import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    fetch("http://localhost:5000/api/dashboard/user-dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) throw new Error(data.message);
        setUser(data.user || null);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err.message);
        navigate("/login");
      });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">User Dashboard</h1>

      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <p className="text-lg font-semibold">Name: <span className="font-normal">{user.name}</span></p>
          <p className="text-lg font-semibold">Email: <span className="font-normal">{user.email}</span></p>
          <p className="text-lg font-semibold">Phone Number: <span className="font-normal">{user.phone || "Not Provided"}</span></p>
          <h2 className="text-xl font-semibold mt-4">Courses Enrolled:</h2>
          {user.courses && user.courses.length > 0 ? (
            <ul className="list-disc pl-6 mt-2">
              {user.courses.map((course, index) => (
                <li key={index} className="text-gray-700">{course}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses enrolled.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading...</p>
      )}
    </div>
  );
};

export default UserDashboard;
