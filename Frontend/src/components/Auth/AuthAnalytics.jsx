import React, { useState, useEffect } from "react";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png'; // ✅ Add this line

import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faExclamationTriangle, faBell, faCheckCircle, faInfoCircle,
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF, faTwitter, faInstagram, faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

const AuthorityAnalytics = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const routerLocation = useLocation();

    useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 0);
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
  const downloadReport = () => {
    // Add your report generation logic here
    console.log("Report downloading...");
  };

  return (
    <div className="bg-[var(--light-color)] font-sans animate-fadeIn min-h-screen">
      {/* Navigation Bar (matched with AuthHome) */}
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
          <img src={logoImage} alt="Complaint ChainLK logo" className="w-40 h-14" />
        </div>

        <div className="hidden md:flex items-center space-x-8">
          { [
            { path: "AuthHome", label: "Home" },
            { path: "AuthComplaints", label: "Complaints" },
            { path: "AuthAnalytics", label: "Analytics" },
            { path: "AuthAlerts", label: "Alerts" }
          ].map((page) => (
            <Link
              key={page.path}
              to={`/${page.path}`}
              className={`text-lg font-semibold ${routerLocation.pathname === `/${page.path}`
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
                }`}
            >
              {page.label}
            </Link>
          )) }
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cprofile">
            <img src={user} alt="User" className="w-12 h-12 rounded-full cursor-pointer" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow space-y-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Analytics</h2>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[var(--accent-color)] p-6 rounded-lg text-center text-white shadow">
            <h3 className="text-lg font-semibold mb-2">Total Complaints</h3>
            <p className="text-4xl font-bold">1,247</p>
          </div>
          <div className="bg-green-200 p-6 rounded-lg text-center text-green-900 shadow">
            <h3 className="text-lg font-semibold mb-2">Resolved</h3>
            <p className="text-4xl font-bold">964</p>
          </div>
          <div className="bg-yellow-200 p-6 rounded-lg text-center text-yellow-900 shadow">
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-4xl font-bold">183</p>
          </div>
        </div>

        {/* Category Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Complaints by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Water</span>
                <span className="font-bold">532</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Electricity</span>
                <span className="font-bold">715</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <img src="https://placehold.co/600x200?text=Chart+Placeholder" alt="Monthly Trend Chart" className="w-full rounded shadow" />
        </div>

        {/* Report Generation */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
          <form className="flex flex-col md:flex-row gap-4 items-center">
            <select className="border p-2 rounded w-full md:w-auto">
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">Category-wise Report</option>
            </select>
            <button
              type="button"
              onClick={downloadReport}
              className="bg-[var(--primary-color)] text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Download
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">Reports are generated in PDF format.</p>
        </div>
      </div>

      {/* Footer (matched with AuthHome) */}
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
                  <Link to="/AuthHome" className={`text-white hover:text-gray-300 transition text-sm font-medium ${routerLocation.pathname === "/AuthHome" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/AuthComplaints" className={`text-white hover:text-gray-300 transition text-sm font-medium ${routerLocation.pathname === "/AuthComplaints" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
                    Complaints
                  </Link>
                </li>
                <li>
                  <Link to="/AuthAnalytics" className={`text-white hover:text-gray-300 transition text-sm font-medium ${routerLocation.pathname === "/AuthAnalytics" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/AuthAlerts" className={`text-white hover:text-gray-300 transition text-sm font-medium ${routerLocation.pathname === "/AuthAlerts" ? "text-gray-300 border-b-2 border-gray-300" : ""}`}>
                    Alerts
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-in-out; }
        :root {
          --primary-color: #334155;
          --accent-color: #94a3b8;
          --dark-color: #1e293b;
          --light-color: #f1f5f9;
          --danger-color: #f87171;
          --warning-color: #facc15;
          --success-color: #6ee7b7;
        }
      `}</style>
    </div>
  );
};

export default AuthorityAnalytics;
