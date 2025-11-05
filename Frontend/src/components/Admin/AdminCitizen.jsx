import React, { useState, useEffect } from "react";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png';
import { Link, useLocation } from 'react-router-dom';

// Font Awesome (footer social icons)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

export default function CitizenTable() {
  const [search, setSearch] = useState("");
  const [citizens, setCitizens] = useState([
    { name: "Kamal Perera", nic: "200123456789", email: "kamal@example.com", address: "Colombo" },
    { name: "Nimali Silva", nic: "995678123V", email: "nimali@example.com", address: "Galle" },
    { name: "Ruwan Jayasuriya", nic: "200245678901", email: "ruwan@example.com", address: "Kandy" },
    { name: "Saman Weerasinghe", nic: "987654321V", email: "saman@example.com", address: "Kurunegala" },
  ]);

  // new: nav scroll state and location for active link
  const [isScrolled, setIsScrolled] = useState(false);
  const routerLocation = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = citizens.filter(
    (citizen) =>
      citizen.name.toLowerCase().includes(search.toLowerCase()) ||
      citizen.nic.toLowerCase().includes(search.toLowerCase()) ||
      citizen.email.toLowerCase().includes(search.toLowerCase()) ||
      citizen.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (nic) => {
    setCitizens(citizens.filter(citizen => citizen.nic !== nic));
  };

  return (
    <>
      {/* 🌐 Navigation Bar */}
      <nav
        id="main-navbar"
        className={`sticky top-0 z-50 transition-all duration-300 container mx-auto px-12 py-6 flex justify-between items-center ${isScrolled
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
          {[{ path: "AuthHome", label: "Home" },
            { path: "AdminAuth", label: "Authority" },
            { path: "AdminCitizen", label: "Citizen" },
            { path: "AdminReport", label: "Report" }
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
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cprofile">
            <img src={user} alt="User" className="w-12 h-12 rounded-full cursor-pointer" />
          </Link>
        </div>
      </nav>

      {/* Main content: Citizen table */}
      <div className="min-h-screen bg-gray-100 py-12 px-8">
        <div className="bg-white rounded-lg shadow p-8 w-full">
          {/* Search Bar and Add Button */}
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search Citizen"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 flex-grow focus:outline-none"
            />
            <button className="bg-green-500 text-white font-bold px-6 py-2 rounded shadow hover:bg-green-600 whitespace-nowrap">
              Add Citizen
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">NIC</th>
                  <th className="px-4 py-2 text-left font-semibold">Email</th>
                  <th className="px-4 py-2 text-left font-semibold">Address</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((citizen, idx) => (
                  <tr key={citizen.nic} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{citizen.name}</td>
                    <td className="px-4 py-2">{citizen.nic}</td>
                    <td className="px-4 py-2">{citizen.email}</td>
                    <td className="px-4 py-2">{citizen.address}</td>

                    <td className="px-4 py-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(citizen.nic)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No citizens found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
    </>
  );
}
