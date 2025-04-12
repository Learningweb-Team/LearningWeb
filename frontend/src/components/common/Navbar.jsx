import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo/logo.png"; // Adjusted path (might need to verify actual path)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600/80 backdrop-blur-md border-b border-blue-300/50 p-4 text-white font-[Poppins] z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1 pl-1">
          <img src={logo} alt="Logo" className="w-15 h-14 object-contain" />
          <span className="text-xl font-bold ml-1">The Digital School</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <NavLinks token={token} role={role} handleLogout={handleLogout} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700/90 backdrop-blur-md p-4 border border-blue-400/40 rounded-lg mt-2">
          <NavLinks 
            onClick={() => setIsOpen(false)} 
            token={token} 
            role={role} 
            handleLogout={handleLogout} 
          />
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ onClick, token, role, handleLogout }) => (
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

    {token ? (
      <>
        {role === "admin" && (
          <Link to="/admin" className="font-bold hover:text-blue-200 transition-colors" onClick={onClick}>
            Admin
          </Link>
        )}
        <button 
          onClick={() => {
            handleLogout();
            onClick?.();
          }} 
          className="text-red-300 font-bold hover:text-red-200 transition-colors"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link to="/login" className="font-bold hover:text-blue-200 transition-colors" onClick={onClick}>
          Login
        </Link>
        <Link to="/signup" className="font-bold hover:text-blue-200 transition-colors" onClick={onClick}>
          Signup
        </Link>
      </>
    )}
  </div>
);

export default Navbar;