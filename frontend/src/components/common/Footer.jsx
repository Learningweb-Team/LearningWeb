// src/components/Footer.js
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const handleHomeClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">The Digital School</h2>
          <p className="mt-3 text-white">
            Empowering learners with high-quality digital courses.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link 
                to="/" 
                onClick={handleHomeClick} 
                className="text-white hover:text-yellow-400 transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/categories" 
                className="text-white hover:text-yellow-400 transition-colors duration-300"
              >
                Course Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="text-white hover:text-yellow-400 transition-colors duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="text-white hover:text-yellow-400 transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white">Contact Us</h3>
          <p className="mt-3 text-white">Email: info@thedigitalschool.com</p>
          <p className="text-white">Phone: +91 9677295576</p>
          <div className="flex space-x-4 mt-4">
            <a 
              href="#" 
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} The Digital School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;