import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Clock, Award, BarChart2, Calendar, FileText, Settings, MessageSquare } from "lucide-react";
import axios from "axios";
import DigitalSchoolLoader from "../components/DigitalSchoolLoader";


const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user data
        const userResponse = await axios.get("http://localhost:5000/api/dashboard/user-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Fetch enrolled courses
        const coursesResponse = await axios.get("http://localhost:5000/api/users/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data.user);
        setEnrolledCourses(coursesResponse.data.courses || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.response?.data?.message || "Failed to fetch data");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-blue-100">Welcome back, {user?.firstName}!</p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow">
              {user?.image ? (
                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl text-blue-600 font-bold">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold text-center">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-blue-600">{user?.role}</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === "overview" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
            >
              <BarChart2 size={18} className="mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === "progress" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
            >
              <Clock size={18} className="mr-3" />
              Learning Progress
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === "certificates" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
            >
              <Award size={18} className="mr-3" />
              Certificates
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === "messages" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
            >
              <MessageSquare size={18} className="mr-3" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
            >
              <Settings size={18} className="mr-3" />
              Account Settings
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500">Enrolled Courses</p>
                      <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500">Certificates</p>
                      <h3 className="text-2xl font-bold">2</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500">Learning Hours</p>
                      <h3 className="text-2xl font-bold">15.5</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Your Courses</h3>
                  <Link to="/courses" className="text-blue-600 text-sm font-medium">Browse More</Link>
                </div>
                
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No courses enrolled yet</h4>
                    <p className="text-gray-500 mb-4">Browse our catalog and find your perfect course</p>
                    <Link to="/courses" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.map(course => {
                      const totalLessons = course.totalLessons || 0;
                      const progress = course.progress || 0;
                      
                      return (
                        <div 
                          key={course._id} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleCourseClick(course._id)}
                        >
                          <div className="flex flex-col h-full">
                            <img 
                              src={course.coverPhotoUrl || '/default-course.jpg'} 
                              alt={course.title}
                              className="w-full h-32 object-cover rounded mb-3"
                              onError={(e) => {
                                e.target.src = '/default-course.jpg';
                              }}
                            />
                            <h4 className="font-medium line-clamp-2">{course.title}</h4>
                            <p className="text-sm text-gray-500 mb-3">{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</p>
                            
                            <div className="mt-auto">
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{progress}% completed</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCourseClick(course._id);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {progress > 0 ? 'Continue' : 'Start'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Started new course</p>
                      <p className="text-sm text-gray-500">Introduction to React - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
                      <Award size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Certificate earned</p>
                      <p className="text-sm text-gray-500">JavaScript Fundamentals - 3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Learning Progress</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Completion Rate</h4>
                  <div className="bg-gray-100 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full" style={{ width: "42%" }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">You've completed 42% of your enrolled courses</p>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Time Spent Learning</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {[15, 30, 45, 60, 45, 30, 15].map((percent, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-sm h-20">
                          <div 
                            className="bg-blue-600 w-full rounded-t-sm" 
                            style={{ height: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain the same */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;