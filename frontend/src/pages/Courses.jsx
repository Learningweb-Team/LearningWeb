import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Boxes } from "../components/Boxes";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/courses");
        
        // Handle different response structures
        const coursesData = response.data.data || response.data;
        
        if (!Array.isArray(coursesData)) {
          throw new Error('Invalid courses data format');
        }
        
        // Ensure each course has a description field
        const coursesWithDescription = coursesData.map(course => ({
          ...course,
          description: course.description || "No description available"
        }));
        
        setCourses(coursesWithDescription);
        setError('');
      } catch (err) {
        console.error("Course fetch error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load courses");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "newest") {
      const publishedDate = new Date(course.publishedAt);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return matchesSearch && publishedDate > thirtyDaysAgo;
    }

    return matchesSearch;
  });

  if (loading) return <div className="text-center py-8 text-white">Loading courses...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      <Boxes className="absolute inset-0 opacity-20" />

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">📚 Available Courses</h1>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="flex-1 px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            <option value="newest">New Courses</option>
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-300">No courses found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-800/80 border border-gray-700 rounded-lg shadow-lg p-6 backdrop-blur-md hover:shadow-xl transition-shadow"
              >
                {course.coverPhotoUrl && (
                  <img
                    src={course.coverPhotoUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-300 line-clamp-3 mb-4 min-h-[60px]">
                  {course.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {course.modules?.length || 0} Modules
                  </span>
                  <Link
                    to={`/course/${course._id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;