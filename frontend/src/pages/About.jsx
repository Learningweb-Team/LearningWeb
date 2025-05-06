import React, { useState } from 'react';
import aboutimg from '../assets/bg_img/aboutimg.jpg';
import { FaChevronDown, FaChevronUp, FaGraduationCap, FaGlobe, FaUsers, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleExploreCourses = () => {
    navigate('/categories');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <img 
          src={aboutimg} 
          alt="Background" 
          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 transition-all duration-500"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-500 hover:text-blue-200">
            About DigitalMastery
          </h1>
          <p className="text-xl text-white max-w-4xl mx-auto transition-opacity duration-500 hover:opacity-90">
            The world's most comprehensive digital marketing education platform empowering professionals across 120+ countries.
          </p>
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            {[
              { icon: <FaGraduationCap className="text-blue-600 text-2xl mr-2" />, number: "50,000+", text: "Students Trained" },
              { icon: <FaGlobe className="text-blue-600 text-2xl mr-2" />, number: "120+", text: "Countries" },
              { icon: <FaUsers className="text-blue-600 text-2xl mr-2" />, number: "200+", text: "Industry Experts" },
              { icon: <FaChartLine className="text-blue-600 text-2xl mr-2" />, number: "95%", text: "Career Growth" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md flex items-center transition-all duration-300 hover:bg-opacity-100 hover:shadow-lg hover:-translate-y-1"
              >
                {stat.icon}
                <div>
                  <p className="font-bold text-lg">{stat.number}</p>
                  <p className="text-sm">{stat.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-20 bg-white bg-opacity-90 rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-black mb-6 transition-colors duration-300 hover:text-blue-600">About DigitalSchool</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-black mb-4 transition-opacity duration-300 hover:opacity-90">
                DigitalSchool is a full-service learning platform dedicated to transforming digital marketing education through cutting-edge courses and industry expertise. Founded in 2022 by a team of digital marketing veterans, we've grown from a small startup to a global education leader.
              </p>
              <p className="text-lg text-black mb-4 transition-opacity duration-300 hover:opacity-90">
                While we've trained over 50,000 marketers globally, we recognize the digital landscape constantly evolves. That's why we're committed to continuously innovating our platform to deliver the most relevant, practical education. Our courses are updated quarterly to reflect the latest industry trends and algorithm changes.
              </p>
              <p className="text-lg text-black mb-4 transition-opacity duration-300 hover:opacity-90">
                As part of our mission, we're building new learning pathways to address emerging technologies like AI-powered marketing, Web3 strategies, and next-generation analytics. We partner with leading tech companies to ensure our curriculum stays ahead of the curve.
              </p>
              <p className="text-lg text-black transition-opacity duration-300 hover:opacity-90">
                What sets us apart is our hands-on approach. Every course includes real-world projects, Q&A sessions, and personalized feedback. Our graduates don't just learn theory—they gain practical skills that get results.
              </p>
              <button 
                onClick={handleSignup}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow hover:shadow-md"
              >
                Sign Up Today
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center bg-opacity-70 h-full transition-all duration-500 hover:bg-opacity-80">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Digital marketing team" 
                  className="rounded-lg shadow-md w-full h-auto transition-transform duration-500 hover:scale-95"
                />
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center transition-all duration-300 hover:bg-blue-100 hover:shadow-md">
                <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">Our Methodology</h3>
                <p className="text-gray-700 transition-colors duration-300 hover:text-gray-800">Learn → Practice → Implement → Succeed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Educational Philosophy Section */}
        <div className="mb-20 bg-white bg-opacity-90 rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-black mb-6 text-center transition-colors duration-300 hover:text-blue-600">Our Educational Philosophy</h2>
          <div className="space-y-6">
            <p className="text-lg text-black transition-opacity duration-300 hover:opacity-90">
              At DigitalMastery, we believe learning should be engaging, practical, and accessible to everyone. Our approach combines the latest educational research with real-world business needs to create transformative learning experiences.
            </p>
            <p className="text-lg text-black transition-opacity duration-300 hover:opacity-90">
              We've developed a unique learning ecosystem that blends interactive content, hands-on projects, and community support. Our courses are designed not just to impart knowledge, but to develop the critical thinking and problem-solving skills needed in today's fast-paced digital landscape.
            </p>
            <p className="text-lg text-black transition-opacity duration-300 hover:opacity-90">
              Our curriculum is continuously refined based on student feedback, industry trends, and emerging technologies. We work closely with hiring managers and industry leaders to ensure our programs develop the most in-demand skills.
            </p>
            <div className="text-center">
              <button 
                onClick={handleSignup}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow hover:shadow-md"
              >
                Join Our Community
              </button>
            </div>
          </div>
        </div>

        {/* Core Offerings Section */}
        <div className="mb-20 bg-white bg-opacity-90 rounded-xl p-8 shadow-lg transition-all duration-500 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-black mb-8 text-center transition-colors duration-300 hover:text-blue-600">Our Core Offerings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Content Creation Mastery', 
                description: 'Learn to create engaging content that converts across all digital platforms',
                expanded: 'Includes video production, copywriting, visual storytelling, and content strategy for blogs, social media, and email marketing.'
              },
              { 
                title: 'Google Ads Certification', 
                description: 'Master search, display, and shopping campaigns with our comprehensive program',
                expanded: 'Covers keyword research, ad creation, bidding strategies, conversion tracking, and advanced optimization techniques.'
              },
              { 
                title: 'Social Media Strategy', 
                description: 'Develop winning strategies for all major social platforms',
                expanded: 'Includes platform-specific tactics for Facebook, Instagram, LinkedIn, Twitter, TikTok, and emerging platforms with community management and crisis communication.'
              },
              { 
                title: 'YouTube Advertising', 
                description: 'Create video ads that engage and convert',
                expanded: 'Learn video ad formats, targeting options, YouTube SEO, analytics, and how to optimize for maximum ROI.'
              },
              { 
                title: 'LinkedIn Marketing Pro', 
                description: 'Leverage LinkedIn for B2B marketing success',
                expanded: 'Covers personal branding, company pages, content strategy, lead generation, and LinkedIn advertising.'
              },
              { 
                title: 'Career Accelerator Program', 
                description: 'Get hired or promoted with our career-focused training',
                expanded: 'Includes resume building, portfolio development, interview preparation, salary negotiation, and ongoing career coaching.'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`bg-blue-50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:bg-blue-100 ${expandedItem === index ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600 block mb-2 transition-colors duration-300 hover:text-blue-700">{`0${index + 1}`}</span>
                    <h3 className="text-lg font-semibold text-black transition-colors duration-300 hover:text-blue-600">{item.title}</h3>
                    <p className="text-gray-700 transition-colors duration-300 hover:text-gray-800">{item.description}</p>
                  </div>
                  <span className="transition-transform duration-300">
                    {expandedItem === index ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-blue-600" />}
                  </span>
                </div>
                {expandedItem === index && (
                  <div className="mt-4 pt-4 border-t border-blue-100 animate-fadeIn">
                    <p className="text-gray-600 transition-opacity duration-300">{item.expanded}</p>
                    <button 
                      onClick={handleSignup}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Sign Up Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={handleSignup}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Unlock All Courses
            </button>
          </div>
        </div>

        {/* Closing Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-8 md:p-12 text-center text-white transition-all duration-500 hover:shadow-xl">
          <h2 className="text-3xl font-bold mb-6 transition-colors duration-300 hover:text-blue-200">
            Start Your Digital Learning Journey Today
          </h2>
          <p className="text-xl max-w-4xl mx-auto mb-8 transition-opacity duration-300 hover:opacity-90">
            Discover our comprehensive course catalog designed to take you from beginner to expert in your chosen digital marketing specialization.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleExploreCourses}
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Explore Courses
            </button>
            <button 
              onClick={handleSignup}
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default About;
