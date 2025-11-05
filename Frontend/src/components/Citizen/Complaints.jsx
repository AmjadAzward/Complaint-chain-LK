import React, { useState, useEffect } from "react";
import logoImage from "../../images/logo1.png";
import user from "../../images/user.png";
import { Link, useLocation } from "react-router-dom";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaHeart, FaComment, FaShare, FaLocationArrow, FaPlusCircle, FaList, FaTrash } from "react-icons/fa";

const ComplaintChainLK = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const complaints = [
    {
      id: 1,
      title: "Garbage not collected for 3 days",
      image: "https://source.unsplash.com/600x400/?garbage",
      user: "Nimal Perera",
      date: "2 hours ago",
      location: "Colombo 05",
      description:
        "Garbage bins are overflowing near the main road. Please take immediate action.",
      tags: ["Garbage", "Environment"],
      status: "Pending",
      likes: 12,
      comments: 4,
    },
    {
      id: 2,
      title: "Broken street light near junction",
      image: "https://source.unsplash.com/600x400/?streetlight",
      user: "Sithara Jayasena",
      date: "5 hours ago",
      location: "Kandy City",
      description:
        "Street light near Temple Junction is broken and causing safety issues at night.",
      tags: ["Lighting", "Safety"],
      status: "In Progress",
      likes: 7,
      comments: 3,
    },
  ];

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
          {[
            { path: "home", label: "Home" },
            { path: "complaint", label: "Complaints" },
            { path: "contactus", label: "Contact Us" },
            { path: "about", label: "About" }
          ].map((page) => (
            <Link
              key={page.path}
              to={`/${page.path}`}
              className={`text-lg font-semibold ${location.pathname === `/${page.path}`
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
          </Link>        </div>
      </nav>

      {/* 🧩 Complaint Feed Section */}
      <div className="p-8 min-h-screen" style={{ background: "#e5e7eb" }}
      >



        {/* Filter Bar */}
        <div className="mb-8">

          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Left side - Filter text + buttons */}
            <div className="flex items-center gap-3">
              <p className="text-1xl font-bold text-gray-800">Filter Complaints</p>
              <select className="rounded-xl border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"> <option>All Location</option> <option>Colombo</option> <option>Kandy</option> <option>Galle</option> </select> <select className="rounded-xl border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"> <option>All Category</option> <option>Garbage</option> <option>Road Damage</option> <option>Water Leak</option> </select> <select className="rounded-xl border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"> <option>All users</option> <option>High</option> <option>Medium</option> <option>Low</option> </select> <select className="rounded-xl border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"> <option>All Priorities</option> <option>High</option> <option>Low</option> </select>

              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                <FaPlusCircle /> Add Complaint
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                <FaLocationArrow /> Set My Live Location
              </button>

            </div>

            {/* Right side - My Complaints */}
            <div>
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all">
                <FaList /> My Complaints
              </button>
            </div>

          </div>
        </div>



        {/* Complaint Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
            >
              <img
                src={complaint.image}
                alt={complaint.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {complaint.title}
                </h3>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>@{complaint.user}</span>
                  <span>{complaint.date}</span>
                </div>

                <p className="text-gray-600 text-sm">{complaint.description}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {complaint.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <FaHeart /> {complaint.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition">
                      <FaComment /> {complaint.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition">
                      <FaShare />
                    </button>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${complaint.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      

      {/* 🌍 Footer */}
      <footer className="bg-slate-900/90 text-white py-8">
        <div className="max-w-3xl mx-auto px-12 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Logo and Description */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <div className="flex items-center mb-2">
                <img src={logoImage} alt="Complaint ChainLK logo" className="w-10 h-10" />
              </div>
              <p className="text-white text-xs leading-relaxed">
                Empowering citizens and authorities to resolve public service issues efficiently,
                transparently, and collaboratively across Sri Lanka.
              </p>
            </div>

            {/* Quick Links */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <h4 className="font-semibold text-base mb-2">Quick Links</h4>
              <ul className="space-y-1">
                {[
                  { path: "home", label: "Home" },
                  { path: "complaint", label: "Complaints" },
                  { path: "contactus", label: "Contact Us" },
                  { path: "about", label: "About" }
                ].map((page) => (
                  <li key={page.path}>
                    <Link
                      to={`/${page.path}`}
                      className={`text-white hover:text-gray-300 transition text-sm font-medium ${location.pathname === `/${page.path}`
                          ? "text-gray-300 border-b-2 border-gray-300"
                          : ""
                        }`}
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="md:w-1/3">
              <h4 className="font-semibold text-base mb-2">Connect With Us</h4>
              <div className="flex space-x-3 mb-2">
                <a href="#" aria-label="Facebook" className="hover:text-gray-300 transition text-xl">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" aria-label="Twitter" className="hover:text-gray-300 transition text-xl">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="#" aria-label="Instagram" className="hover:text-gray-300 transition text-xl">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-gray-300 transition text-xl">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
              <p className="text-xs">
                Email:{" "}
                <a
                  href="mailto:info@complaintchainlk.lk"
                  className="underline hover:text-gray-300"
                >
                  info@complaintchainlk.lk
                </a>
              </p>
              <p className="text-xs mt-1">
                Hotline:{" "}
                <a href="tel:+94112223344" className="underline hover:text-gray-300">
                  +94 112 223344
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-3 text-center text-xs">
            &copy; 2025 Complaint ChainLK. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default ComplaintChainLK;
