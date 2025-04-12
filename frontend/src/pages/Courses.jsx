import { useEffect, useState } from "react";
import axios from "axios";
import { Boxes } from "../components/Boxes"; // ✅ Import animation component

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      {/* Animated Background */}
      <Boxes className="absolute inset-0 opacity-20" /> 

      {/* Course Content */}
      <div className="relative z-10 p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">📚 Available Courses</h2>
        {courses.length === 0 ? <p className="text-center">No courses available</p> : null}
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course._id} className="border border-gray-700 p-4 rounded-lg shadow-lg bg-gray-800/80 backdrop-blur-md">
              <h3 className="text-xl font-bold">{course.title}</h3>
              <p className="text-gray-300">{course.description}</p>
              <video controls className="w-full mt-2 rounded-lg">
                <source src={course.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
