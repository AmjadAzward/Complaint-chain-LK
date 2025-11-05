import React, { useState, useEffect } from "react";
import logoImage from '../../images/logo1.png';
import ch from '../../images/ch.png';
import user from '../../images/user.png';
import { Link, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';


// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlusCircle,
    faSearch,
    faBars,
    faMapMarkerAlt,
    faCloudUploadAlt,
    faCheck,
    faComments,
    faSyncAlt,
    faCheckCircle,
    faTint,
    faBolt,
    faRoad,
    faTrash,
    faTree,
    faBus,
    faEllipsisH,
    faUserCheck,
    faBuilding as faBuildingIcon,
    faUsers
} from '@fortawesome/free-solid-svg-icons';

import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

// Added complaints data and the ComplaintFilter component
const complaintsData = [
    {
        id: 1,
        title: 'Severe Water Leakage - Water',
        location: 'Colombo 05, near the market area',
        reporter: 'R. Jayasena',
        time: '2 days ago',
        priority: 'Medium',
    },
    {
        id: 2,
        title: 'Dangerous Pothole - Road',
        location: 'Galle Road, near Sarasavi Bookshop',
        reporter: 'N. Thilak',
        time: '1 hour ago',
        priority: 'Medium',
    },
    {
        id: 3,
        title: 'Street Light Fault - Electricity',
        location: 'Kandy, Temple Road section',
        reporter: 'D. Fernando',
        time: '3 days ago',
        priority: 'Medium',
    },
];

const ComplaintFilter = () => {
    const [filterLocation, setFilterLocation] = useState('All Locations');
    const [category, setCategory] = useState('All Categories');
    const [priority, setPriority] = useState('All Priorities');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredComplaints = complaintsData.filter(c => {
        const matchesLocation = filterLocation === 'All Locations' || c.location.includes(filterLocation);
        const matchesCategory = category === 'All Categories' || c.title.includes(category);
        const matchesPriority = priority === 'All Priorities' || c.priority === priority;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesLocation && matchesCategory && matchesPriority && matchesSearch;
    });

    return (

        <div className="p-5 bg-gray-200 w-full flex flex-col items-stretch">
            <div className="mb-2 flex flex-wrap gap-3 items-center">
                <span className="font-semibold mr-2">Filter your complaints:</span>
                <select
                    value={filterLocation}
                    onChange={e => setFilterLocation(e.target.value)}
                    className="rounded border border-gray-400 py-1 px-3 bg-white"
                >
                    <option>All Locations</option>
                    <option>Colombo 05</option>
                    <option>Galle Road</option>
                    <option>Kandy</option>
                </select>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="rounded border border-gray-400 py-1 px-3 bg-white"
                >
                    <option>All Categories</option>
                    <option>Water</option>
                    <option>Road</option>
                    <option>Electricity</option>
                </select>
                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="rounded border border-gray-400 py-1 px-3 bg-white"
                >
                    <option>All Priorities</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Low</option>
                </select>
                <input
                    type="text"
                    placeholder="Search complaints"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="rounded border border-gray-400 py-1 px-3 flex-grow max-w-xs"
                />
                <button className="bg-indigo-600 text-white px-4 py-1 rounded">Search</button>
            </div>

            <div className="bg-white rounded-lg w-full shadow p-4 divide-y divide-gray-300">
                {filteredComplaints.map(c => (
                    <div key={c.id} className="py-3 flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-gray-800">{c.title}</div>
                            <div className="text-gray-500 text-sm">{c.location}</div>
                            <div className="text-gray-400 text-xs mt-1 flex gap-2 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.48 0 4.79.72 6.879 1.95M15 19h5v-2a7 7 0 00-14 0v-2h5m7-3a4 4 0 104-4 4 4 0 00-4 4z" />
                                </svg>
                                {c.reporter}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
                                </svg>
                                {c.time}
                            </div>
                        </div>
                        <div className="bg-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                            {c.priority}
                        </div>
                    </div>
                ))}
                {filteredComplaints.length === 0 && <div className="text-center py-10 text-gray-500">No complaints found.</div>}
            </div>
        </div>
    );
};

const ComplaintChainLK = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const routerLocation = useLocation(); // renamed to avoid shadowing

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                        { path: "AuthHome", label: "Home" },
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
                    </Link>        </div>
            </nav>

            {/* Hero Section */}
            <section
                className="h-[60vh] w-full flex flex-col items-center justify-center text-center p-4"
                style={{ backgroundColor: '#3849594D' }}
            >
                <div>
                    <h1
                        style={{
                            fontFamily: '"Segoe UI", sans-serif',
                            fontWeight: 900,
                            fontSize: '64px',
                            lineHeight: '100%',
                            letterSpacing: 0,
                            color: '#555555',
                        }}
                        className="mb-2"
                    >
                        Your Voice Matters
                    </h1>
                    <p
                        className="text-lg max-w-xl mx-auto"
                        style={{ color: '#666666' }}
                    >
                        Report public service issues and track their resolution in real-time
                    </p>
                </div>
            </section>


            {/* Quick Stats Section (Placed Above Benefits Section) */}
<section className="w-full bg-gray-100 py-16 flex justify-center">
  <div className="w-full max-w-6xl px-6">
    <h2 className="text-3xl font-bold text-center mb-10">Quick Stats</h2>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <div className="bg-gray-300 rounded-lg py-10 flex flex-col items-center shadow-md">
        <strong className="text-4xl font-bold">120</strong>
        <span className="text-lg">Total Citizens</span>
      </div>
      <div className="bg-gray-300 rounded-lg py-10 flex flex-col items-center shadow-md">
        <strong className="text-4xl font-bold">25</strong>
        <span className="text-lg">Total Authorities</span>
      </div>
      <div className="bg-gray-300 rounded-lg py-10 flex flex-col items-center shadow-md">
        <strong className="text-4xl font-bold">7</strong>
        <span className="text-lg">Pending Requests</span>
      </div>
      <div className="bg-gray-300 rounded-lg py-10 flex flex-col items-center shadow-md">
        <strong className="text-4xl font-bold">12</strong>
        <span className="text-lg">Reports</span>
      </div>
    </div>

    {/* Recent Activity */}
    <h3 className="text-2xl font-semibold text-center mb-6">Recent Activity</h3>
    <div className="bg-white rounded-lg w-full p-6 shadow-md space-y-4">
      <div className="flex justify-between text-gray-700">
        <span>User John Doe updated profile</span>
        <span className="text-gray-400 text-sm">1 hour ago</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>New report submitted by Jane Smith</span>
        <span className="text-gray-400 text-sm">2 hours ago</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>New Authority added</span>
        <span className="text-gray-400 text-sm">5 hours ago</span>
      </div>
    </div>
  </div>
</section>



            {/* Benefits Section */}
            <section className="bg-[#e5e7eb] py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Benefits of Complaint ChainLK</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* For Citizens */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="w-full">
                                <FontAwesomeIcon icon={faUserCheck} className="text-3xl mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold mb-2 text-center">For Citizens</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Easy submission anytime, anywhere</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Real-time tracking of complaint status</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Transparent communication with authorities</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Community collaboration options</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* For Authorities */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="w-full">
                                <FontAwesomeIcon icon={faBuildingIcon} className="text-3xl mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold mb-2 text-center">For Authorities</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Centralized dashboard for complaint management</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Automated status updates and notifications</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Data-driven insights for better resource allocation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Improved public trust and transparency</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* For Community */}
                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="w-full">
                                <FontAwesomeIcon icon={faUsers} className="text-3xl mb-4 text-gray-600" />
                                <h3 className="text-xl font-semibold mb-2 text-center">For Community</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Collective action for faster resolutions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Public visibility of common issues</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Encourages civic engagement</span>
                                    </li>
                                    <li className="flex items-start">
                                        <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-gray-600" />
                                        <span>Builds a stronger, safer community</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
