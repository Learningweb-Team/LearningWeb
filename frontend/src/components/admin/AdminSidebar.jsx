import React from 'react';
import { 
  FiVideo, 
  FiUsers, 
  FiBarChart2, 
  FiMessageSquare,
  FiBook,
  FiCalendar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) => {
  return (
    <div 
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0
        fixed top-0 left-0 bottom-0 h-screen overflow-y-auto z-40`}
    >
      {/* Header with toggle button */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold">DIGITAL MARKETING</h1>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            DM
          </div>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </button>
      </div>
      
      {/* Navigation sections with dark background */}
      <nav className="p-4 space-y-6">
        {/* Dashboard section */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            My Dashboard
          </h2>
          <ul className="space-y-2">
            {['Courses', 'Students', 'Analytics', 'Messages'].map((tab) => (
              <li 
                key={tab}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
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
                  { className: `mr-3 ${activeTab === tab ? 'text-white' : 'text-gray-400'}` }
                )}
                {isSidebarOpen && (
                  <span>{tab}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Course Management section */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            Course Management
          </h2>
          <ul className="space-y-2">
            {['All Courses', 'Schedule'].map((item) => (
              <li 
                key={item}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  activeTab === item 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setActiveTab(item)}
              >
                {React.createElement(
                  item === 'All Courses' ? FiBook : FiCalendar,
                  { className: `mr-3 ${activeTab === item ? 'text-white' : 'text-gray-400'}` }
                )}
                {isSidebarOpen && <span>{item}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('email');
              window.location.href = '/login';
            }}
            className={`flex items-center w-full p-3 rounded-lg transition-all hover:bg-gray-800 text-gray-300 hover:text-white ${
              !isSidebarOpen ? 'justify-center' : ''
            }`}
          >
            <FiLogOut className={isSidebarOpen ? "mr-3" : ""} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;