import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown, LogOut, Settings, BookOpen } from "lucide-react";
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const emailFromStorage = localStorage.getItem("email");

          setUserData({
            name: "Profile",
            email: emailFromStorage || "user@example.com",
            avatar: null,
            coursesEnrolled: 5,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
    setShowProfileDropdown(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full ${isScrolled ? "bg-blue-600/100 " : "bg-blue-600/100 "} transition-all duration-300 border-b border-blue-300/30 p-4 text-white font-[Poppins] z-50`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-1 pl-1">
          <img src={logo} alt="Logo" className="w-15 h-14 object-contain" />
          <span className="text-xl font-bold ml-1">The Digital School</span>
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <NavLinks token={token} role={role} onClick={() => setIsOpen(false)} />

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 bg-black/30 hover:bg-blue-700/70 px-3 py-2 rounded-lg transition-all"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-400/80 flex items-center justify-center">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="font-medium">{userData?.name || "Profile"}</span>
                <ChevronDown size={16} className={`transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 bg-blue-500 text-white">
                    <p className="text-sm font-medium">{userData?.name || "Profile"}</p>
                    <p className="text-xs truncate">{userData?.email || "user@example.com"}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <User size={16} className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/my-courses"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <BookOpen size={16} className="mr-2" />
                      My Courses ({userData?.coursesEnrolled || 0})
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    {role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-black/30 hover:bg-blue-700/70 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-white/90 text-black rounded-lg hover:bg-white transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none bg-black/30 hover:bg-blue-700/70 p-2 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-700/90 backdrop-blur-sm p-4 border border-blue-400/30 rounded-lg mt-2">
          <NavLinks onClick={() => setIsOpen(false)} token={token} role={role} />

          {token ? (
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <div className="flex items-center space-x-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-blue-400/80 flex items-center justify-center">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{userData?.name || "Profile"}</p>
                  <p className="text-sm text-blue-200">{userData?.email || "user@example.com"}</p>
                </div>
              </div>

              <Link
                to="/profile"
                className="block py-2 px-2 rounded bg-black/30 hover:bg-blue-700/70 transition-colors mb-2"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              <Link
                to="/my-courses"
                className="block py-2 px-2 rounded bg-black/30 hover:bg-blue-700/70 transition-colors mb-2"
                onClick={() => setIsOpen(false)}
              >
                My Courses ({userData?.coursesEnrolled || 0})
              </Link>
              <Link
                to="/settings"
                className="block py-2 px-2 rounded bg-black/30 hover:bg-blue-700/70 transition-colors mb-2"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="block py-2 px-2 rounded bg-black/30 hover:bg-blue-700/70 transition-colors mb-2"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-2 rounded bg-black/30 text-red-300 hover:bg-blue-700/70 transition-colors mt-2"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-blue-400/30 flex flex-col space-y-3">
              <Link
                to="/login"
                className="text-center py-2 rounded-lg bg-black/30 hover:bg-blue-700/70 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-center py-2 bg-white/90 text-black rounded-lg hover:bg-white transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ onClick, token, role }) => (
  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
    <Link to="/" className="hover:text-blue-200 transition-colors" onClick={onClick}>
      Home
    </Link>
    <Link to="/courses" className="hover:text-blue-200 transition-colors" onClick={onClick}>
      Courses
    </Link>
    <Link to="/about" className="hover:text-blue-200 transition-colors" onClick={onClick}>
      About
    </Link>
    {token && role === "admin" && (
      <Link to="/admin" className="font-bold hover:text-blue-200 transition-colors" onClick={onClick}>
        Admin Dashboard
      </Link>
    )}
  </div>
);

export default Navbar;