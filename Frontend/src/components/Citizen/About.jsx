import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';

const About = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

{/* Navigation */}
<nav
  id="main-navbar"
  className={`sticky top-0 z-50 transition-all duration-300 container mx-auto px-12 py-6 flex justify-between items-center ${
    isScrolled
      ? "bg-slate-800 text-white [&_*]:text-white shadow-lg backdrop-blur bg-opacity-95"
      : "bg-white text-slate-900 shadow-sm"
  }`}
  style={{
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "90px",
  }}
>
  <div className="flex items-center space-x-4">
    <img
      src={logoImage}
      alt="Complaint ChainLK logo"
      className="w-40 h-14"
    />
  </div>

  <div className="hidden md:flex items-center space-x-8">
    <Link
      to="/home"
      className={`text-lg font-semibold ${
        location.pathname === "/home"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
      }`}
    >
      Home
    </Link>
    <Link
      to="/complaint"
      className={`text-lg font-semibold ${
        location.pathname === "/complaint"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
      }`}
    >
      Complaints
    </Link>
    <Link
      to="/contactus"
      className={`text-lg font-semibold ${
        location.pathname === "/contactus"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
      }`}
    >
      Contact Us
    </Link>
    <Link
      to="/about"
      className={`text-lg font-semibold ${
        location.pathname === "/about"
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
      }`}
    >
      About
    </Link>
  </div>

  <div className="flex items-center space-x-4">
 <Link to="/cprofile">
      <img src={user} alt="User" className="w-12 h-12 rounded-full cursor-pointer" />
    </Link>  </div>
</nav>


      {/* Main Content */}
      <div className="bg-[#ececec] py-8 border-t-2 border-b-2">
        <div className="max-w-xl mx-auto rounded-lg shadow-md bg-white p-8">
          <h2 className="text-2xl font-semibold text-center mb-3 text-slate-900">About Complaint ChainLK</h2>
          <p className="text-slate-700 mb-4 text-center">
            Complaint ChainLK is a public service platform designed to empower citizens and authorities in Sri Lanka to resolve community issues efficiently and transparently. Our mission is to bridge the gap between the public and service departments, making it easier to report, track, and resolve complaints.
          </p>
          <ul className="list-disc list-inside text-slate-700 mb-3">
            <li>Easy complaint submission with location and photo uploads</li>
            <li>Real-time tracking and status updates</li>
            <li>Centralized dashboard for authorities</li>
            <li>Community engagement and feedback</li>
          </ul>
          <p className="text-slate-700 text-center">
            Together, we aim to build a safer, cleaner, and more responsive Sri Lanka.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-100 py-10">
        <h3 className="text-2xl font-semibold text-center mb-8 text-slate-900">Meet Our Team</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-md">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mark Robers" className="w-24 h-24 rounded-full mb-2" />
            <span className="font-bold text-slate-900">Mark Robers</span>
            <span className="text-slate-600 text-sm">CEO</span>
          </div>
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-md">
            <img src="https://randomuser.me/api/portraits/men/15.jpg" alt="Bob Marley" className="w-24 h-24 rounded-full mb-2" />
            <span className="font-bold text-slate-900">Bob Marley</span>
            <span className="text-slate-600 text-sm">Secretary</span>
          </div>
          <div className="bg-white rounded-lg p-6 flex flex-col items-center shadow-md">
            <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Habbab Khan" className="w-24 h-24 rounded-full mb-2" />
            <span className="font-bold text-slate-900">Habbab Khan</span>
            <span className="text-slate-600 text-sm">Manager</span>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-gray-50 py-10">
        <h3 className="text-2xl font-semibold text-center mb-8 text-slate-900">Our Partners</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <img src="https://i.ibb.co/WDmk521/zero-plastic.png" alt="Zero Plastic" className="w-28 h-28 object-contain bg-white rounded-lg shadow" />
          <img src="https://i.ibb.co/NWJHgsp/feo.png" alt="FEO" className="w-28 h-28 object-contain bg-white rounded-lg shadow" />
          <img src="https://i.ibb.co/dQ3zntP/nature-protection.png" alt="Nature Protection" className="w-28 h-28 object-contain bg-white rounded-lg shadow" />
        </div>
      </div>

{/* Footer */}
<footer className="bg-slate-900/90 text-white py-8">
  <div className="max-w-3xl mx-auto px-12 py-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
      {/* Logo and Description */}
      <div className="mb-4 md:mb-0 md:w-1/3">
        <div className="flex items-center mb-2">
          <img
            src={logoImage}
            alt="Complaint ChainLK logo"
            className="w-10 h-10"
          />
        </div>
        <p className="text-white text-xs leading-relaxed">
          Empowering citizens and authorities to resolve public service issues efficiently, transparently, and collaboratively across Sri Lanka.
        </p>
      </div>
      {/* Quick Links */}
      <div className="mb-4 md:mb-0 md:w-1/3">
        <h4 className="font-semibold text-base mb-2">Quick Links</h4>
        <ul className="space-y-1">
          <li>
            <Link to="/home" className={`text-white hover:text-gray-300 transition text-sm font-medium ${location.pathname === "/home" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/complaint" className={`text-white hover:text-gray-300 transition text-sm font-medium ${location.pathname === "/complaint" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
              Complaints
            </Link>
          </li>
          <li>
            <Link to="/contactus" className={`text-white hover:text-gray-300 transition text-sm font-medium ${location.pathname === "/contactus" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/about" className={`text-white hover:text-gray-300 transition text-sm font-medium ${location.pathname === "/about" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
              About
            </Link>
          </li>
        </ul>
      </div>
      {/* Social & Contact */}
      <div className="md:w-1/3">
        <h4 className="font-semibold text-base mb-2">Connect With Us</h4>
        <div className="flex space-x-3 mb-2">
          <a href="#" aria-label="Facebook" className="text-white hover:text-gray-300 transition text-xl">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a href="#" aria-label="Twitter" className="text-white hover:text-gray-300 transition text-xl">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#" aria-label="Instagram" className="text-white hover:text-gray-300 transition text-xl">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-white hover:text-gray-300 transition text-xl">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
        <p className="text-white text-xs">
          Email:{" "}
          <a href="mailto:info@complaintchainlk.lk" className="underline hover:text-gray-300">
            info@complaintchainlk.lk
          </a>
        </p>
        <p className="text-white text-xs mt-1">
          Hotline:{" "}
          <a href="tel:+94112223344" className="underline hover:text-gray-300">
            +94 112 223344
          </a>
        </p>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-6 pt-3 text-center text-xs text-white">
      &copy; 2025 Complaint ChainLK. All rights reserved.
    </div>
  </div>
</footer>
    </>
  );
};

export default About;
