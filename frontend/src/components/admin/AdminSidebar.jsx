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
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } fixed top-0 left-0 h-screen bg-white shadow-md transition-all duration-300 ease-in-out z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {isSidebarOpen ? (
          <h1 className="text-lg font-bold text-blue-600 whitespace-nowrap">The Digital School</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            D
          </div>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-blue-600 transition"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? '«' : '»'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Dashboard */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            My Dashboard
          </h2>
          <ul className="space-y-2">
            {[
              { name: 'Courses', icon: FiVideo },
              { name: 'Students', icon: FiUsers },
              { name: 'Analytics', icon: FiBarChart2 },
              { name: 'Messages', icon: FiMessageSquare }
            ].map(({ name, icon: Icon }) => (
              <li
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  activeTab === name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-3 text-lg" />
                {isSidebarOpen && <span>{name}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Course Management */}
        <div>
          <h2 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${!isSidebarOpen && 'hidden'}`}>
            Course Management
          </h2>
          <ul className="space-y-2">
            {[
              { name: 'All Courses', icon: FiBook },
              { name: 'Schedule', icon: FiCalendar }
            ].map(({ name, icon: Icon }) => (
              <li key={name} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <Icon className="mr-3 text-lg" />
                {isSidebarOpen && <span>{name}</span>}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer (Logout) */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <FiLogOut className="mr-3 text-lg" />
          {isSidebarOpen && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
