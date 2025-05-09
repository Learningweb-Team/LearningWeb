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

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) => {
  return (
    <div 
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0
        fixed top-0 left-0 bottom-0 h-screen overflow-y-auto z-50`}
    >
      {/* Header with logo and toggle button */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold text-gray-800">
            DIGITAL MARKETING
          </h1>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            DM
          </div>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
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
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100 text-gray-700'
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
                  { className: `mr-3 ${activeTab === tab ? 'text-blue-600' : 'text-gray-500'}` }
                )}
                {isSidebarOpen && (
                  <span className={`${activeTab === tab ? 'font-medium' : 'font-normal'}`}>
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
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700 transition-all duration-200 hover:translate-x-1"
                onClick={() => setActiveTab(item)}
              >
                {React.createElement(
                  item === 'All Courses' ? FiBook : FiCalendar,
                  { className: "mr-3 text-gray-500" }
                )}
                {isSidebarOpen && <span className="font-normal">{item}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Logout button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('email');
              window.location.href = '/login';
            }}
            className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:translate-x-1 group"
          >
            <FiLogOut className="mr-3 group-hover:text-red-600 transition-colors" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;