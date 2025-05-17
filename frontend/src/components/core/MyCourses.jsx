import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, BarChart2 } from 'lucide-react';
import axios from 'axios';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users/my-courses',
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

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your courses</h2>
        <Link 
          to="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-8">Loading your courses...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Courses ({enrolledCourses.length})</h1>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-medium mb-2">No courses enrolled yet</h3>
          <p className="mb-4">Explore our courses to get started!</p>
          <Link 
            to="/courses" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map(course => (
            <div key={course._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/courses/${course._id}`}>
                <img 
                  src={course.coverPhotoUrl || '/default-course.jpg'} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Clock size={14} className="mr-1" />
                    <span>{course.modules?.reduce((acc, mod) => acc + (mod.classes?.length || 0), 0)} lessons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart2 size={14} className="mr-1" />
                      <span>{course.progress || 0}% completed</span>
                    </div>
                    <Link 
                      to={`/courses/${course._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;