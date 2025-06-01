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
  FiChevronRight,
  FiHome,
  FiSettings
} from 'react-icons/fi';

const AdminSidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeTab, 
  setActiveTab, 
  mobileView = false 
}) => {
  return (
    <div 
      className={`
        ${mobileView ? 'w-full' : isSidebarOpen ? 'w-56 md:w-64' : 'w-14 md:w-20'}
        bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0
        ${mobileView ? 'h-[calc(100vh-56px)]' : 'fixed top-0 left-0 bottom-0 h-screen overflow-y-auto z-40'}
      `}
    >
      {/* Header with toggle button - hidden on mobile */}
      {!mobileView && (
        <div className="p-3 md:p-4 border-b border-gray-700 flex items-center justify-between">
          {isSidebarOpen ? (
            <h1 className="text-lg md:text-xl font-bold truncate">DIGITAL SCHOOL</h1>
          ) : (
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              DS
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
          >
            {isSidebarOpen ? (
              <FiChevronLeft size={18} className="md:w-5 md:h-5" />
            ) : (
              <FiChevronRight size={18} className="md:w-5 md:h-5" />
            )}
          </button>
        </div>
      )}
      
      {/* Navigation sections */}
      <nav className="p-2 md:p-4 space-y-4 md:space-y-6">
        {/* Dashboard section */}
        <div>
          <h2 className={`
            text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 md:mb-3 
            ${(!isSidebarOpen && !mobileView) && 'hidden'}
          `}>
            My Dashboard
          </h2>
          <ul className="space-y-1 md:space-y-2">
            {[
              { name: 'Home', icon: FiHome, tab: 'Home' },
              { name: 'Courses', icon: FiVideo, tab: 'Courses' },
              { name: 'Students', icon: FiUsers, tab: 'Students' },
              { name: 'Analytics', icon: FiBarChart2, tab: 'Analytics' },
              { name: 'Messages', icon: FiMessageSquare, tab: 'Messages' }
            ].map((item) => (
              <li 
                key={item.tab}
                className={`
                  flex items-center p-2 md:p-3 rounded-lg cursor-pointer transition-all 
                  ${activeTab === item.tab 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                  }
                `}
                onClick={() => setActiveTab(item.tab)}
              >
                <item.icon className={`
                  ${isSidebarOpen || mobileView ? "mr-2 md:mr-3" : "mx-auto"}
                  ${activeTab === item.tab ? 'text-white' : 'text-gray-400'}
                  w-4 h-4 md:w-5 md:h-5
                `} />
                {(isSidebarOpen || mobileView) && (
                  <span className="text-sm md:text-base truncate">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Course Management section */}
        <div>
          <h2 className={`
            text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 md:mb-3 
            ${(!isSidebarOpen && !mobileView) && 'hidden'}
          `}>
            Course Management
          </h2>
          <ul className="space-y-1 md:space-y-2">
            {[
              { name: 'All Courses', icon: FiBook, tab: 'All Courses' },
              { name: 'Schedule', icon: FiCalendar, tab: 'Schedule' }
            ].map((item) => (
              <li 
                key={item.tab}
                className={`
                  flex items-center p-2 md:p-3 rounded-lg cursor-pointer transition-all 
                  ${activeTab === item.tab 
                    ? 'bg-blue-700 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                  }
                `}
                onClick={() => setActiveTab(item.tab)}
              >
                <item.icon className={`
                  ${isSidebarOpen || mobileView ? "mr-2 md:mr-3" : "mx-auto"}
                  ${activeTab === item.tab ? 'text-white' : 'text-gray-400'}
                  w-4 h-4 md:w-5 md:h-5
                `} />
                {(isSidebarOpen || mobileView) && (
                  <span className="text-sm md:text-base truncate">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Settings and Logout */}
        <div className="pt-2 md:pt-4 border-t border-gray-700">
          {/* Settings */}
          <button
            className={`
              flex items-center w-full p-2 md:p-3 rounded-lg transition-all 
              hover:bg-gray-800 text-gray-300 hover:text-white
              ${!isSidebarOpen && !mobileView ? 'justify-center' : ''}
            `}
          >
            <FiSettings className={`
              ${isSidebarOpen || mobileView ? "mr-2 md:mr-3" : ""}
              w-4 h-4 md:w-5 md:h-5
            `} />
            {(isSidebarOpen || mobileView) && <span className="text-sm md:text-base">Settings</span>}
          </button>

          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('email');
              window.location.href = '/login';
            }}
            className={`
              flex items-center w-full p-2 md:p-3 rounded-lg transition-all 
              hover:bg-gray-800 text-gray-300 hover:text-white
              ${!isSidebarOpen && !mobileView ? 'justify-center' : ''}
            `}
          >
            <FiLogOut className={`
              ${isSidebarOpen || mobileView ? "mr-2 md:mr-3" : ""}
              w-4 h-4 md:w-5 md:h-5
            `} />
            {(isSidebarOpen || mobileView) && <span className="text-sm md:text-base">Logout</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;