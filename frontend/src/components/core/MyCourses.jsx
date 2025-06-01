import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, BarChart2 } from 'lucide-react';
import DigitalSchoolLoader from "../DigitalSchoolLoader";
import axios from 'axios';
import { Boxes } from "../../components/Boxes";


const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          'https://digital-schools-backend.onrender.com/api/users/my-courses',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setEnrolledCourses(response.data.courses || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchEnrolledCourses();
  }, [token]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleContinueClick = (courseId, e) => {
    e.stopPropagation(); // Prevent the parent div's click handler from firing
    navigate(`/course/${courseId}`);
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your courses</h2>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <DigitalSchoolLoader />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;


  if (error) return (
    <div className="text-center py-8 text-red-500">
      <p className="font-medium">Error loading courses:</p>
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Try Again
      </button>
    </div>
  );

  return (
    


    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      <Boxes className="absolute inset-0 opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Rest of your MyCourses component JSX */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <span className="text-gray-600">
            {enrolledCourses.length} {enrolledCourses.length === 1 ? 'course' : 'courses'}
          </span>
        </div>
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No courses enrolled yet</h3>
          <p className="mb-4 text-gray-600">Explore our courses to get started!</p>
          <Link 
            to="/courses" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => {
            const totalLessons = course.totalLessons || 0;
            const progress = course.progress || 0;
            
            return (
              <div 
                key={course._id} 
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="h-full flex flex-col">
                  <img 
                    src={course.coverPhotoUrl || '/default-course.jpg'} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/default-course.jpg';
                    }}
                  />
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Clock size={14} className="mr-1" />
                      <span>{totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center text-sm">
                        <BarChart2 size={14} className="mr-1" />
                        <span>{progress}% completed</span>
                      </div>
                      <button
                        onClick={(e) => handleContinueClick(course._id, e)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
    </div>

  );
};

export default MyCourses;
