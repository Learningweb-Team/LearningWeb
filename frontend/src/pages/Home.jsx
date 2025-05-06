import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bg1 from "../assets/bg_img/bg1.jpg";
import bg2 from "../assets/bg_img/bg2.jpg";
import bg3 from "../assets/bg_img/bg3.jpg";
import bg4 from "../assets/bg_img/bg4.jpg";
import feature1 from "../assets/features/feature1.jpg";
import feature2 from "../assets/features/feature2.jpg";
import feature3 from "../assets/features/feature3.jpg";

const Home = () => {
  const images = [bg1, bg2, bg3, bg4];
  const content = [
    {
      heading: ["Master", "Digital Marketing"],
      subheading: "The future belongs to those who learn more skills and combine them in creative ways.",
    },
    {
      heading: ["Unlock", "Your Potential"],
      subheading: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    },
    {
      heading: ["From Basics", "to Pro"],
      subheading: "Your Digital Marketing Journey Starts Here!",
    },
    {
      heading: ["Achieve", "Your Dreams"],
      subheading: "Turn your passion into expertise with structured learning and guidance.",
    },
  ];

  const tricolorRGB = "linear-gradient(90deg, rgb(8, 71, 196), rgb(9, 242, 191), rgb(47, 209, 11))";
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const featuresRef = useRef(null);
  const coursesRef = useRef(null);

  const handleCourseClick = (e, path) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    navigate(token ? path : "/login", { state: { from: path } });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-features');
        }
      });
    }, observerOptions);

    const coursesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-courses');
        }
      });
    }, observerOptions);

    if (featuresRef.current) {
      featuresObserver.observe(featuresRef.current);
    }

    if (coursesRef.current) {
      coursesObserver.observe(coursesRef.current);
    }

    return () => {
      if (featuresRef.current) {
        featuresObserver.unobserve(featuresRef.current);
      }
      if (coursesRef.current) {
        coursesObserver.unobserve(coursesRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: "Expert Instructors",
      description: "Our digital marketing e-learning platform features expert instructors with extensive industry experience in YouTube ads, social media marketing, LinkedIn mastery, and more.",
      color: "text-green-600",
      image: feature1,
      bgColor: "from-green-100 to-white"
    },
    {
      title: "Flexible Learning",
      description: "Our learning platform offers flexible learning designed to fit your schedule and lifestyle. With 24/7 access to courses, you can learn at your own pace.",
      color: "text-cyan-600",
      image: feature2,
      bgColor: "from-cyan-100 to-white"
    },
    {
      title: "Certification",
      description: "Earn a recognized certification upon completing our digital marketing courses, validating your skills in YouTube ads, social media marketing, and more.",
      color: "text-orange-600",
      image: feature3,
      bgColor: "from-orange-100 to-white"
    }
  ];

  const courses = [
    {
      title: "LinkedIn Master",
      description: "Master LinkedIn strategies to build a professional brand, generate leads, and grow your network effectively.",
      color: "text-indigo-600",
      path: "/courses/linkedin-master"
    },
    {
      title: "Social Media Marketing",
      description: "Learn to create engaging content, run ads, and grow your brand on Instagram, Facebook, and LinkedIn.",
      color: "text-red-600",
      path: "/courses/social-media-marketing"
    },
    {
      title: "YouTube Ads",
      description: "Discover how to create, optimize, and manage YouTube ad campaigns to drive traffic and maximize ROI.",
      color: "text-teal-600",
      path: "/courses/youtube-ads"
    },
    {
      title: "Performance Marketing",
      description: "Master data-driven strategies to optimize campaigns, track performance, and achieve measurable results.",
      color: "text-purple-600",
      path: "/courses/performance-marketing"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                transition: "opacity 1s ease-in-out, transform 4s ease-in-out",
                filter: "brightness(80%) contrast(110%) saturate(120%)",
              }}
            ></div>
          ))}
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-6">
          <div className="transition-opacity duration-700" style={{ opacity: fade ? 1 : 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold space-x-2 mb-6">
              <span
                style={{
                  backgroundImage: tricolorRGB,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "inline-block",
                  padding: "0 4px",
                }}
              >
                {content[currentIndex].heading[0]}
              </span>{" "}
              <span className="text-white">{content[currentIndex].heading[1]}</span>
            </h1>
            <p className="mt-4 text-lg lg:text-xl italic max-w-3xl mx-auto">
              {content[currentIndex].subheading}
            </p>
          </div>

          <button
            onClick={(e) => handleCourseClick(e, "/courses")}
            className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-colors duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Learning
          </button>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="relative w-6 h-10 border-2 border-white rounded-full">
              <div 
                className="absolute top-1 left-1/2 w-1 h-2 bg-white rounded-full -translate-x-1/2 animate-bounce"
                style={{ animationDuration: '2s' }}
              ></div>
            </div>
            <p className="mt-2 text-white text-sm animate-pulse">Scroll Down</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full" ref={featuresRef}>
        {features.map((feature, index) => (
          <section 
            key={index}
            className={`w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b ${feature.bgColor}`}
          >
            <div className="max-w-7xl mx-auto">
              {index === 0 && (
                <div className="text-center mb-12 animate-features opacity-0 translate-y-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
                    Why Choose Us?
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We provide the best digital marketing education with practical approach
                  </p>
                </div>
              )}
              
              <div 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                <div className="md:w-1/2 p-4">
                  <h3 className={`text-2xl md:text-3xl font-semibold ${feature.color} mb-4 animate-features opacity-0 ${
                    index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed animate-features opacity-0 ${
                    index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'
                  }`} style={{ animationDelay: '100ms' }}>
                    {feature.description}
                  </p>
                  <button
                    onClick={(e) => handleCourseClick(e, "/about")}
                    className={`mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-300 inline-block animate-features opacity-0 ${
                      index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'
                    }`} style={{ animationDelay: '200ms' }}
                  >
                    Learn More
                  </button>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className={`rounded-xl shadow-lg w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300 animate-features opacity-0 ${
                      index % 2 === 0 ? 'translate-x-10' : '-translate-x-10'
                    }`} style={{ animationDelay: '100ms' }}
                  />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Courses Section */}
      <section 
        ref={coursesRef}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[rgba(220,240,255,0.8)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-courses opacity-0 translate-y-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">
              Popular Courses
            </h2>
            <p className="text-lg text-gray-800 max-w-3xl mx-auto">
              Start your learning journey with our most popular courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 animate-courses opacity-0 translate-y-10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-2xl font-semibold ${course.color} mb-4`}>
                  {course.title}
                </div>
                <p className="text-gray-600 mb-6">
                  {course.description}
                </p>
                <button
                  onClick={(e) => handleCourseClick(e, course.path)}
                  className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 block text-center hover:scale-105 transform"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 animate-courses opacity-0 translate-y-10" style={{ animationDelay: '300ms' }}>
            <button
              onClick={(e) => handleCourseClick(e, "/categories")}
              className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-md hover:scale-105 transform"
            >
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style>{`
        .animate-features {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        
        .animate-courses {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;