import React, { useState, useRef, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoImage from '../../images/logo1.png';
import user from '../../images/user.png';
import {
  FaUserCircle,
  FaSpinner,
  FaTint,
  FaClock,
  FaUserShield,
  FaSearch,
  FaTimesCircle,
  FaHistory,
  FaEye,
  FaFire,
  FaUserCheck,
  FaBan,
  FaCheckCircle,
  FaTrash,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const initialChats = {
  inProgress: [
    { author: "Authority", text: "We have received your complaint and are currently investigating.", type: "authority" },
    { author: "You", text: "Thank you for the update!", type: "user" },
    { author: "Authority", text: "We will get back to you shortly with more information.", type: "authority" },
  ],
  toReview: [
    { author: "Safety Team", text: "Your complaint is currently under review for potential hazards.", type: "authority" },
    { author: "You", text: "Please let me know if you need any additional info.", type: "user" },
    { author: "Safety Team", text: "We will update you with findings soon.", type: "authority" },
  ],
  rejected: [
    { author: "Authority", text: "Your complaint has been reviewed and rejected due to invalid issue.", type: "authority" },
    { author: "You", text: "Thank you for the update.", type: "user" },
  ],
  history: [
    { author: "Authority", text: "Garbage collection completed successfully.", type: "authority" },
    { author: "You", text: "Thanks for resolving it.", type: "user" },
  ],
};

const UserComplaintTrack = () => {
  const [activeSection, setActiveSection] = useState("inProgress"); // default

  // scroll state and location hook — use the imported logoImage and user from the top imports
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

const scrollToForm = () => {
  formRef.current?.scrollIntoView({ behavior: "smooth" });
};

  const handleAddComplaint = () => {
    // navigate to Home and pass state to instruct Home to scroll to the complaint form
    navigate("/home", { state: { scrollToComplaint: true } });
  };


  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [showDetails, setShowDetails] = useState({
    inProgress: false,
    toReview: false,
    rejected: false,
    history: false,
  });

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const [complaintReason, setComplaintReason] = useState("");
  const [complaintFileName, setComplaintFileName] = useState(null);

  const [chats, setChats] = useState(initialChats);
  const [newMessages, setNewMessages] = useState({
    inProgress: "",
    toReview: "",
    rejected: "",
    history: "",
  });

  // chat refs to auto-scroll
  const chatRefs = {
    inProgress: useRef(null),
    toReview: useRef(null),
    rejected: useRef(null),
    history: useRef(null),
  };

  
  // Auto-scroll when chats change
  useEffect(() => {
    Object.keys(chatRefs).forEach((k) => {
      const ref = chatRefs[k];
      if (ref && ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    });
  }, [chats]);

  const switchSection = (sectionKey) => {
    setActiveSection(sectionKey);
    // optional: collapse others
    setShowDetails((prev) => ({ ...prev, [sectionKey]: prev[sectionKey] })); // keep current state only
  };

  const toggleDetails = (sectionKey) => {
    setShowDetails((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const openWithdrawModal = () => setWithdrawOpen(true);
  const closeWithdrawModal = () => setWithdrawOpen(false);

  const submitWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawReason.trim()) {
      alert("Please provide a reason for withdrawal.");
      return;
    }
    // Here you would send to backend
    alert("Withdrawal submitted: " + withdrawReason);
    setWithdrawReason("");
    closeWithdrawModal();
  };

  const openComplaintForm = () => setComplaintOpen(true);
  const closeComplaintForm = () => {
    setComplaintOpen(false);
    setComplaintReason("");
    setComplaintFileName(null);
  };

  const submitComplaint = (e) => {
    e.preventDefault();
    if (!complaintReason.trim()) {
      alert("Please enter reason for complaint.");
      return;
    }
    // Simulate submission
    alert("Complaint submitted successfully!");
    closeComplaintForm();
  };

  const sendMessage = (sectionKey) => {
    const content = (newMessages[sectionKey] || "").trim();
    if (!content) return;
    const newChat = [...chats[sectionKey], { author: "You", text: content, type: "user" }];
    setChats((prev) => ({ ...prev, [sectionKey]: newChat }));
    setNewMessages((prev) => ({ ...prev, [sectionKey]: "" }));
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) setComplaintFileName(file.name);
    else setComplaintFileName(null);
  };

  // simplified progress widths per section
  const progressWidths = {
    inProgress: "50%",
    toReview: "100%",
    rejected: "100%",
    history: "100%",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🌐 Navigation Bar */}
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
            { path: "home", label: "Home" },
            { path: "complaint", label: "Complaints" },
            { path: "contactus", label: "Contact Us" },
            { path: "about", label: "About" }
          ].map((page) => (
            <Link
              key={page.path}
              to={`/${page.path}`}
              className={`text-lg font-semibold ${
                location.pathname === `/${page.path}`
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
<div className="flex justify-end mt-6 mr-6">
  <button
    onClick={handleAddComplaint}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg text-sm font-semibold transition-all"
    aria-label="Add Complaint"
  >
    + Add Complaint
  </button>
</div>




      {/* MAIN */}
      <div className="container mx-auto px-4 py-8">
        <main style={{ marginTop: 5, padding: 5 }}>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Track Your Complaints</h2>
        </main>

        {/* Navigation Buttons (tabs) */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            id="btnInProgress"
            onClick={() => switchSection("inProgress")}
            className={`px-4 py-2 rounded-md ${activeSection === "inProgress" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaSpinner className="inline mr-2" /> In Progress
          </button>

          <button
            id="btnToReview"
            onClick={() => switchSection("toReview")}
            className={`px-4 py-2 rounded-md ${activeSection === "toReview" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaSearch className="inline mr-2" /> To Review
          </button>

          <button
            id="btnRejected"
            onClick={() => switchSection("rejected")}
            className={`px-4 py-2 rounded-md ${activeSection === "rejected" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaTimesCircle className="inline mr-2" /> Rejected
          </button>

          <button
            id="btnHistory"
            onClick={() => switchSection("history")}
            className={`px-4 py-2 rounded-md ${activeSection === "history" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaHistory className="inline mr-2" /> History
          </button>
        </div>

        {/* SECTION: In Progress */}
        <div className={`${activeSection === "inProgress" ? "block" : "hidden"}`}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto" id="sectionInProgress">
            <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div>
                <p className="text-sm text-gray-500">Complaint Number</p>
                <h3 className="text-xl font-bold text-indigo-600">20046</h3>
              </div>
              <div className="h-10 border-l border-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">Date Submitted</p>
                <h3 className="text-xl font-bold">Aug 5, 2025</h3>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:space-x-3">
              <span className="status-badge status-inprogress flex items-center bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                <FaSpinner className="mr-2 animate-spin" /> In Progress
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full flex items-center">
                <FaTint className="mr-2" /> Water Issue
              </span>
              <span className="ml-auto text-gray-600 text-sm flex items-center">
                <FaClock className="mr-2" /> Last updated: Today, 3:42 PM
              </span>
            </div>

            <div className="progress-container relative">
              <div className="progress-connector absolute left-0 right-0 top-4 h-1 bg-gray-200"></div>
              <div className="progress-completed absolute left-0 top-4 h-1 bg-indigo-600" style={{ width: progressWidths.inProgress }}></div>

              <div className="flex justify-between items-center relative z-10 px-6">
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Submitted</span>
                </div>

                <div className="progress-step active flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center"></div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">In Review</span>
                </div>

                <div className="progress-step flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full border-4 border-gray-300 bg-white flex items-center justify-center"></div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Resolved</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button id="seeMoreButton" onClick={() => toggleDetails("inProgress")} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition mb-4">
                {showDetails.inProgress ? "See Less" : "See More"}
              </button>

              <button id="withdrawButton" onClick={openWithdrawModal} className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition mb-4 ml-2">
                Withdraw
              </button>
            </div>

            <div className={`details-container ${showDetails.inProgress ? "block" : "hidden"} mt-4`} id="detailsContainer">
              <h4 className="font-semibold mb-2">Complaint Details:</h4>
              <p><strong>Category:</strong> Water Issues</p>
              <p><strong>Description:</strong> Please provide details about the issue...</p>
              <p><strong>Location:</strong> Enter exact address or landmark</p>
              <p><strong>Priority:</strong> High (Immediate danger/safety issue)</p>
              <p><strong>Visibility:</strong> Public (Visible to everyone)</p>
            </div>

            <div className={`progress-updates-container ${showDetails.inProgress ? "block" : "hidden"} mt-6`} id="progressUpdatesContainer">
              <h4 className="font-semibold mb-2">Progress Updates:</h4>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FaUserShield className="text-green-600" />
                    </div>
                    <span className="font-medium">Communicate with Authority</span>
                  </div>
                  <span className="text-sm text-gray-500">Active now</span>
                </div>

                {/* Chat container */}
                <div ref={chatRefs.inProgress} className="chat-container mb-4 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {chats.inProgress.map((m, i) => (
                    <div key={i} className="chat-message mb-3">
                      <span className="author font-semibold">{m.author}:</span>{" "}
                      <span className={`message inline-block px-3 py-1 rounded-lg ${m.type === "user" ? "bg-blue-200" : "bg-gray-200"}`}>{m.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center mt-4 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    className="input-field flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type your message..."
                    value={newMessages.inProgress}
                    onChange={(e) => setNewMessages((p) => ({ ...p, inProgress: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage("inProgress"); } }}
                  />
                  <button className="send-button ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => sendMessage("inProgress")}>Send</button>
                </div>
              </div>
            </div>

            {/* Withdraw Modal markup placed outside visually, but kept here for structure */}
          </div>
        </div>

        {/* SECTION: To Review */}
        <div className={`${activeSection === "toReview" ? "block" : "hidden"}`}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto" id="sectionToReview">
            <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div>
                <p className="text-sm text-gray-500">Complaint Number</p>
                <h3 className="text-xl font-bold text-indigo-600">20046</h3>
              </div>
              <div className="h-10 border-l border-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">Date Submitted</p>
                <h3 className="text-xl font-bold">Aug 5, 2025</h3>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:space-x-3">
              <span className="status-badge status-to-review flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full font-medium">
                <FaEye className="mr-2" /> To Review
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center">
                <FaFire className="mr-2" /> Fire Issue
              </span>
              <span className="ml-auto text-gray-600 text-sm flex items-center">
                <FaClock className="mr-2" /> Last updated: Today, 1:15 PM
              </span>
            </div>

            <div className="progress-container relative">
              <div className="progress-connector absolute left-0 right-0 top-4 h-1 bg-gray-200"></div>
              <div className="progress-completed absolute left-0 top-4 h-1 bg-indigo-600" style={{ width: progressWidths.toReview }}></div>

              <div className="flex justify-between items-center relative z-10 px-6">
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Submitted</span>
                </div>
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">In Review</span>
                </div>
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Resolved</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button id="addReviewButton" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition">Add a Review</button>
              <button id="dismissButton" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition">Dismiss</button>
            </div>

            <div className={`details-container mt-6 ${showDetails.toReview ? "block" : "hidden"}`} id="detailsContainerToReview">
              <h4 className="font-semibold mb-2">Complaint Details:</h4>
              <p><strong>Category:</strong> Fire Issues</p>
              <p><strong>Description:</strong> Please provide details about the fire hazard...</p>
              <p><strong>Location:</strong> Enter exact address or landmark</p>
              <p><strong>Priority:</strong> Medium (Requires attention soon)</p>
              <p><strong>Visibility:</strong> Private (Restricted access)</p>
            </div>

            <div className={`progress-updates-container mt-6 ${showDetails.toReview ? "block" : "hidden"}`} id="progressUpdatesContainerToReview">
              <h4 className="font-semibold mb-2">Progress Updates:</h4>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <FaUserCheck className="text-yellow-700" />
                    </div>
                    <span className="font-medium">Under Review by Safety Team</span>
                  </div>
                  <span className="text-sm text-gray-500">Review in progress</span>
                </div>

                <div ref={chatRefs.toReview} className="chat-container mb-4 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {chats.toReview.map((m, i) => (
                    <div key={i} className="chat-message mb-3">
                      <span className="author font-semibold">{m.author}:</span>{" "}
                      <span className={`message inline-block px-3 py-1 rounded-lg ${m.type === "user" ? "bg-yellow-200" : "bg-yellow-100"}`}>{m.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center mt-4 bg-gray-50 p-3 rounded-lg">
                  <input
                    type="text"
                    className="input-field flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Type your message..."
                    value={newMessages.toReview}
                    onChange={(e) => setNewMessages((p) => ({ ...p, toReview: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage("toReview"); } }}
                  />
                  <button className="send-button ml-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700" onClick={() => sendMessage("toReview")}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Rejected */}
        <div className={`${activeSection === "rejected" ? "block" : "hidden"}`}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto" id="sectionRejected">
            <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div>
                <p className="text-sm text-gray-500">Complaint Number</p>
                <h3 className="text-xl font-bold text-indigo-600">20046</h3>
              </div>
              <div className="h-10 border-l border-gray-200"></div>
              <div>
                <p className="text-sm text-gray-500">Date Submitted</p>
                <h3 className="text-xl font-bold">Aug 5, 2025</h3>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:space-x-3">
              <span className="status-badge status-rejected flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full font-medium">
                <FaTimesCircle className="mr-2" /> Rejected
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full flex items-center">
                <FaBan className="mr-2" /> Invalid Issue
              </span>
              <span className="ml-auto text-gray-600 text-sm flex items-center">
                <FaClock className="mr-2" /> Last updated: Yesterday, 11:00 AM
              </span>
            </div>

            <div className="progress-container relative">
              <div className="progress-connector absolute left-0 right-0 top-4 h-1 bg-gray-200"></div>
              <div className="progress-completed absolute left-0 top-4 h-1 bg-indigo-600" style={{ width: progressWidths.rejected }}></div>

              <div className="flex justify-between items-center relative z-10 px-6">
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Submitted</span>
                </div>
                <div className="progress-step completed flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">In Review</span>
                </div>
                <div className="progress-step active flex flex-col items-center">
                  <div className="circle w-8 h-8 rounded-full border-4 border-indigo-600 bg-indigo-600 flex items-center justify-center text-white">✗</div>
                  <span className="step-label mt-2 text-sm font-semibold text-slate-600">Rejected</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => { alert("Complaint dismissed."); }} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Dismiss</button>
              <button onClick={openComplaintForm} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Complain a File</button>
            </div>

            <div className={`details-container mt-6 ${showDetails.rejected ? "block" : "hidden"}`} id="detailsContainerRejected">
              <h4 className="font-semibold mb-2">Complaint Details:</h4>
              <p><strong>Category:</strong> Invalid Issue</p>
              <p><strong>Description:</strong> The complaint was reviewed and found invalid.</p>
              <p><strong>Location:</strong> N/A</p>
              <p><strong>Priority:</strong> None</p>
              <p><strong>Visibility:</strong> Private</p>
            </div>

            <div className={`progress-updates-container mt-6 ${showDetails.rejected ? "block" : "hidden"}`} id="progressUpdatesContainerRejected">
              <h4 className="font-semibold mb-2">Progress Updates:</h4>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FaUserCheck className="text-red-700" />
                    </div>
                    <span className="font-medium">Complaint Rejected by Authority</span>
                  </div>
                  <span className="text-sm text-gray-500">Decision made</span>
                </div>

                <div ref={chatRefs.rejected} className="chat-container mb-4 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {chats.rejected.map((m, i) => (
                    <div key={i} className="chat-message mb-3">
                      <span className="author font-semibold">{m.author}:</span>{" "}
                      <span className={`message inline-block px-3 py-1 rounded-lg ${m.type === "user" ? "bg-gray-200" : "bg-red-100"}`}>{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: History */}
        <div className={`${activeSection === "history" ? "block" : "hidden"}`}>
          <div id="sectionHistory" className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Complaint History</h2>

            <div className="mb-8 border-t pt-6">
              <div className="flex flex-col space-y-2 mb-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div>
                  <p className="text-sm text-gray-500">Complaint Number</p>
                  <h3 className="text-xl font-bold text-indigo-600">10001</h3>
                </div>
                <div className="h-10 border-l border-gray-200"></div>
                <div>
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <h3 className="text-xl font-bold">Aug 4, 2025</h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:space-x-3">
                <span className="status-badge status-resolved flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                  <FaCheckCircle className="mr-2" /> Resolved
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center">
                  <FaTrash className="mr-2" /> Garbage Issue
                </span>
                <span className="ml-auto text-gray-600 text-sm flex items-center">
                  <FaClock className="mr-2" /> Last updated: Aug 5, 2025
                </span>
              </div>

              <div className="progress-container relative">
                <div className="progress-connector absolute left-0 right-0 top-4 h-1 bg-gray-200"></div>
                <div className="progress-completed absolute left-0 top-4 h-1 bg-indigo-600" style={{ width: progressWidths.history }}></div>

                <div className="flex justify-between items-center relative z-10 px-6">
                  <div className="progress-step completed flex flex-col items-center">
                    <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                    <span className="step-label mt-2 text-sm font-semibold text-slate-600">Submitted</span>
                  </div>
                  <div className="progress-step completed flex flex-col items-center">
                    <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                    <span className="step-label mt-2 text-sm font-semibold text-slate-600">In Review</span>
                  </div>
                  <div className="progress-step completed flex flex-col items-center">
                    <div className="circle w-8 h-8 rounded-full bg-indigo-600 border-4 border-indigo-600 flex items-center justify-center text-white">✓</div>
                    <span className="step-label mt-2 text-sm font-semibold text-slate-600">Resolved</span>
                  </div>
                </div>
              </div>

              <div className="details-container mt-6">
                <h4 className="font-semibold mb-2">Complaint Details:</h4>
                <p><strong>Category:</strong> Garbage Issue</p>
                <p><strong>Description:</strong> Garbage collection was delayed for two days.</p>
                <p><strong>Location:</strong> Street 14, Main Road</p>
                <p><strong>Priority:</strong> Medium</p>
                <p><strong>Visibility:</strong> Public</p>
              </div>

              <div className="progress-updates-container mt-6">
                <h4 className="font-semibold mb-2">Progress Updates:</h4>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FaUserCheck className="text-green-700" />
                      </div>
                      <span className="font-medium">Issue Resolved by Authority</span>
                    </div>
                    <span className="text-sm text-gray-500">Aug 5, 2025</span>
                  </div>

                  <div ref={chatRefs.history} className="chat-container mb-4 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    {chats.history.map((m, i) => (
                      <div key={i} className="chat-message mb-3">
                        <span className="author font-semibold">{m.author}:</span>{" "}
                        <span className={`message inline-block px-3 py-1 rounded-lg ${m.type === "user" ? "bg-gray-200" : "bg-green-100"}`}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Modal */}
        {withdrawOpen && (
          <div id="withdrawModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Withdraw Complaint</h2>
              <form id="withdrawForm" onSubmit={submitWithdraw}>
                <label htmlFor="withdrawReason" className="block mb-2 font-semibold">Reason for Withdrawal</label>
                <textarea id="withdrawReason" name="withdrawReason" required className="w-full p-2 border rounded mb-4" placeholder="Please explain why you want to withdraw your complaint..." value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeWithdrawModal} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complain Submission Modal (for Rejected) */}
        {complaintOpen && (
          <div id="complaintModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Complain Submission</h2>
              <form id="complaintForm" onSubmit={submitComplaint}>
                <label className="block mb-2 font-semibold">Reason for Complaint</label>
                <textarea name="reason" required className="w-full p-2 border rounded mb-4" placeholder="Describe the issue..." value={complaintReason} onChange={(e) => setComplaintReason(e.target.value)}></textarea>

                <label className="block mb-2 font-semibold">Attach File (optional)</label>
                <input type="file" name="attachment" className="mb-4" onChange={onFileChange} />
                {complaintFileName && <div className="text-sm mb-2 text-gray-600">Selected file: {complaintFileName}</div>}

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeComplaintForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={{ background: "#1e293b", color: "#f1f5f9" }} className="mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
            <div className="mb-8 md:mb-0 md:w-1/3">
              <div className="flex items-center mb-4">
                <img src="https://placehold.co/48x48" alt="logo" className="rounded-full mr-3" />
                <span className="font-bold text-2xl tracking-tight">Complaint ChainLK</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Empowering citizens and authorities to resolve public service issues efficiently, transparently, and collaboratively across Sri Lanka.</p>
            </div>

            <div className="mb-8 md:mb-0 md:w-1/3">
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-accent-color transition text-gray-300">Home</a></li>
                <li><a href="#" className="hover:text-accent-color transition text-gray-300">Complaints</a></li>
                <li><a href="#" className="hover:text-accent-color transition text-gray-300">Departments</a></li>
                <li><a href="#" className="hover:text-accent-color transition text-gray-300">Statistics</a></li>
                <li><a href="#" className="hover:text-accent-color transition text-gray-300">About</a></li>
              </ul>
            </div>

            <div className="md:w-1/3">
              <h4 className="font-semibold text-lg mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4 text-2xl text-gray-300">
                <FaFacebookF />
                <FaTwitter />
                <FaInstagram />
                <FaLinkedinIn />
              </div>
              <p className="text-gray-400 text-sm">Email: <a href="mailto:info@complaintchainlk.lk" className="underline">info@complaintchainlk.lk</a></p>
              <p className="text-gray-400 text-sm mt-1">Hotline: <a href="tel:+94112223344" className="underline">+94 112 223344</a></p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-400">
            &copy; 2025 Complaint ChainLK. All rights reserved. | Designed with <span className="text-accent-color">♥</span> in Sri Lanka
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserComplaintTrack;
