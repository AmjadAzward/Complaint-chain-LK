import React, { useState, useEffect } from "react";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ComplaintChainLK = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const routerLocation = useLocation();

  const [expandedId, setExpandedId] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    1023: [
      {
        sender: "Applicant",
        message: "Please resolve this soon!",
        time: "2025-08-20 09:15",
      },
      {
        sender: "Authority",
        message: "We are looking into it.",
        time: "2025-08-20 09:30",
      },
    ],
  });
  const [chatInputs, setChatInputs] = useState({ 1023: "" });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sendMessage = (id) => {
    if (chatInputs[id].trim() !== "") {
      const newMessage = {
        sender: "Authority",
        message: chatInputs[id],
        time: new Date().toLocaleString(),
      };
      setChatMessages((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), newMessage],
      }));
      setChatInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <>
      {/* Navigation Bar */}
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
          {[
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
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cprofile">
            <img src={user} alt="User" className="w-12 h-12 rounded-full cursor-pointer" />
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10 ">
        {/* Filter/Search Bar */}
        <section className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            className="px-3 py-2 border rounded-lg w-full md:w-1/4"
            placeholder="Search by title, location, or ID"
          />
          <select className="px-3 py-2 border rounded-lg">
            <option value="">All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option value="">All Categories</option>
            <option>Water</option>
            <option>Garbage</option>
            <option>Road</option>
            <option>Electricity</option>
            <option>Sidewalk</option>
            <option>Corruption</option>
          </select>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg w-full md:w-1/4"
            placeholder="Filter by date"
          />
        </section>

        {/* Complaint Management Table */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Review & Resolve Complaints</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Assigned To</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">#1023</td>
                  <td className="px-4 py-2">Water Leakage</td>
                  <td className="px-4 py-2">Water</td>
                  <td className="px-4 py-2">Kandy</td>
                  <td className="px-4 py-2">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-2">High</td>
                  <td className="px-4 py-2">
                    <select className="border rounded px-2 py-1" defaultValue="Team A">
                      <option>Unassigned</option>
                      <option>Team A</option>
                      <option>Team B</option>
                      <option>Team C</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">2025-08-20</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      title="Expand"
                      onClick={() => toggleDetails(1023)}
                    >
                      <FontAwesomeIcon
                        icon={expandedId === 1023 ? faChevronUp : faChevronDown}
                      />
                    </button>
                  </td>
                </tr>

                {expandedId === 1023 && (
                  <tr className="details-row bg-gray-50">
                    <td colSpan="9" className="px-6 py-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">Complaint Details</h3>
                          <p><strong>ID:</strong> #1023</p>
                          <p><strong>Title:</strong> Water Leakage</p>
                          <p><strong>Category:</strong> Water</p>
                          <p><strong>Location:</strong> Kandy</p>
                          <p><strong>Description:</strong> Major water leakage near the main road, causing inconvenience to residents.</p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                          </p>
                          <p><strong>Priority:</strong> High</p>
                          <p><strong>Assigned To:</strong> Team A</p>
                          <p><strong>Date:</strong> 2025-08-20</p>
                          <div className="flex gap-2 mt-4">
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                              Mark as Resolved
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                              Reject
                            </button>
                            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                              Assign
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 border-l pl-6">
                          <h3 className="font-bold text-lg mb-2">Chat with Applicant</h3>
                          <div
                            className="bg-white border rounded-lg p-3 h-64 overflow-y-auto flex flex-col gap-2 mb-2"
                            id="chat-1023"
                          >
                            {(chatMessages[1023] || []).map((msg, idx) => (
                              <div
                                key={idx}
                                className={
                                  msg.sender === "Applicant"
                                    ? "flex flex-col items-start"
                                    : "flex flex-col items-end"
                                }
                              >
                                <span
                                  className={`px-3 py-1 rounded-lg mb-1 ${
                                    msg.sender === "Applicant"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-200 text-gray-800"
                                  }`}
                                >
                                  {msg.sender}: {msg.message}
                                </span>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                              </div>
                            ))}
                          </div>
                          <form
                            className="flex gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              sendMessage(1023);
                            }}
                          >
                            <input
                              type="text"
                              id="chat-input-1023"
                              className="flex-1 border rounded-lg px-3 py-2"
                              placeholder="Type your message..."
                              value={chatInputs[1023] || ""}
                              onChange={(e) =>
                                setChatInputs((prev) => ({ ...prev, 1023: e.target.value }))
                              }
                            />
                            <button
                              type="submit"
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              Send
                            </button>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

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
};

export default ComplaintChainLK;
