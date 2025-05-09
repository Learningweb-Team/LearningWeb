import React from 'react';
import { 
  FiVideo, 
  FiUsers, 
  FiBarChart2, 
  FiMessageSquare,
  FiBook,
  FiCalendar,
  FiLogOut
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) => {
  return (
    <div 
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-gradient-to-b from-blue-50 to-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0
        fixed top-0 left-0 bottom-0 h-screen overflow-y-auto z-50`}
    >
      {/* Header with logo and toggle button */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Digital Marketing
          </h1>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            D
          </div>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? (
            <span className="text-lg">«</span>
          ) : (
            <span className="text-lg">»</span>
          )}
        </button>
      </div>
      
      {/* Navigation sections */}
      <nav className="p-4 space-y-6">
        {/* Dashboard section */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            My Dashboard
          </h2>
          <ul className="space-y-2">
            {['Courses', 'Students', 'Analytics', 'Messages'].map((tab) => (
              <li 
                key={tab}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 shadow-inner border-l-4 border-blue-500' 
                    : 'hover:bg-blue-50 hover:text-blue-500 hover:translate-x-1'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {React.createElement(
                  {
                    Courses: FiVideo,
                    Students: FiUsers,
                    Analytics: FiBarChart2,
                    Messages: FiMessageSquare
                  }[tab],
                  { className: `mr-3 ${activeTab === tab ? 'scale-110' : ''}` }
                )}
                {isSidebarOpen && (
                  <span className={`font-medium ${activeTab === tab ? 'font-semibold' : ''}`}>
                    {tab}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Course Management section */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            Course Management
          </h2>
          <ul className="space-y-2">
            {['All Courses', 'Schedule'].map((item) => (
              <li 
                key={item}
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-500 transition-all duration-200 hover:translate-x-1"
              >
                {React.createElement(
                  item === 'All Courses' ? FiBook : FiCalendar,
                  { className: "mr-3" }
                )}
                {isSidebarOpen && <span className="font-medium">{item}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-gray-200">
          <Link 
            to="/" 
            className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:translate-x-1 group"
          >
            <FiLogOut className="mr-3 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </Link>
        </div>
      </nav>
      
      {/* Decorative floating elements (visible only when expanded) */}
      {isSidebarOpen && (
        <>
          <div className="absolute bottom-10 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          <div className="absolute top-1/4 -right-2 w-4 h-16 bg-blue-400 rounded-full opacity-10 animate-float" />
          <div className="absolute top-2/3 -right-1 w-3 h-10 bg-blue-600 rounded-full opacity-10 animate-float-delay" />
        </>
      )}
    </div>
  );
};

export default AdminSidebar;