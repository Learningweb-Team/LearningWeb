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
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`}>
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold text-blue-600">Digital Marketing Pro</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            D
          </div>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-blue-600 transition-colors"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? '«' : '»'}
        </button>
      </div>
      
      <nav className="p-4 space-y-6">
        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            My Dashboard
          </h2>
          <ul className="space-y-2">
            {['Courses', 'Students', 'Analytics', 'Messages'].map((tab) => (
              <li 
                key={tab}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab)}
              >
                {React.createElement(
                  {
                    Courses: FiVideo,
                    Students: FiUsers,
                    Analytics: FiBarChart2,
                    Messages: FiMessageSquare
                  }[tab],
                  { className: "mr-3" }
                )}
                {isSidebarOpen && tab}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            Course Management
          </h2>
          <ul className="space-y-2">
            {['All Courses', 'Schedule'].map((item) => (
              <li 
                key={item}
                className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {React.createElement(
                  item === 'All Courses' ? FiBook : FiCalendar,
                  { className: "mr-3" }
                )}
                {isSidebarOpen && item}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Link 
            to="/" 
            className="flex items-center w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-3" />
            {isSidebarOpen && 'Logout'}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;