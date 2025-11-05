import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn, 
} from '@fortawesome/free-brands-svg-icons';

const ContactUs = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [showAssistant, setShowAssistant] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dummy AI response (replace with real integration if needed)
  const handleAiSubmit = (e) => {
    e.preventDefault();
    setAiMessage("How can I help you with your subject: " + subject + "?");
  };

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


      {/* Floating AI Assistant Button */}
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center z-50 hover:bg-blue-700 transition"
        onClick={() => setShowAssistant(!showAssistant)}
        aria-label="Open AI Assistant"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
      >
        <FontAwesomeIcon icon={faRobot} className="text-2xl" />
        <span className="ml-2 font-semibold hidden md:inline">AI Assistant</span>
      </button>

      {/* Floating AI Assistant Panel */}
      {showAssistant && (
        <div className="fixed bottom-24 right-8 bg-white rounded-lg shadow-xl p-6 w-80 z-50 border border-blue-600">
          <div className="flex items-center mb-3">
            <FontAwesomeIcon icon={faRobot} className="text-blue-600 text-xl mr-2" />
            <span className="font-bold text-blue-600">AI Assistant</span>
            <button
              className="ml-auto text-slate-500 hover:text-red-500"
              onClick={() => setShowAssistant(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleAiSubmit} className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              rows={3}
              placeholder="Type your question..."
              className="border border-slate-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition"
            >
              Ask
            </button>
          </form>
          {aiMessage && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-sm text-blue-900">
              {aiMessage}
            </div>
          )}
        </div>
      )}

      {/* Contact Us Form */}
      <div className="bg-[#d6dde3] min-h-screen flex flex-col justify-center items-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact Us</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Have questions, feedback, or need support? Reach out to us using the form below or via our hotline/email.
          </p>
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your name"
              className="border border-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Subject"
              className="border border-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="border border-slate-400 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded py-2 transition"
            >
              Send Message
            </button>
          </form>
          <p className="text-xs text-slate-700 mt-4">
            Email:{" "}
            <a href="mailto:info@complaintchainlk.lk" className="underline hover:text-blue-600">
              info@complaintchainlk.lk
            </a>
            <br />
            Hotline:{" "}
            <a href="tel:+94112223344" className="underline hover:text-blue-600">
              +94 112 223344
            </a>
          </p>
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

export default ContactUs;