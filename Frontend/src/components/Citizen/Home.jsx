import React, { useState, useEffect, useRef } from "react";
import logoImage from '../../images/logo1.png';
import ch from '../../images/ch.png';
import user from '../../images/user.png';
import { Link, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import FileUpload from "../Citizen/FileUpload"; // adjust path if different
import LocationPicker from "../Citizen/LocationPicker"; // adjust path!
import AddressAutocomplete from "../Citizen/AddressAutocomplete"; // adjust path!
import { useLocation as useRouterLocation } from "react-router-dom";


// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faSearch,
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
  faBuilding as faBuildingIcon,
  faEllipsisH,
  faUserCheck,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';

const ComplaintChainLK = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const complaintFormRef = useRef(null);
  const [pickedLocation, setPickedLocation] = useState(null); // for map/location picker
  const routerLocation = useRouterLocation(); // for current URL path
  const location = useLocation(); // ✅ get current path
 const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [visibility, setVisibility] = useState("");
  const [category, setCategory] = useState("");
const [selectedFile, setSelectedFile] = useState(null);

  console.log(routerLocation.pathname); // safe to use
  console.log(pickedLocation); // the location picked by user
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.scrollToComplaint) {
      const el = document.getElementById("complaintSubmission");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#complaintSubmission" && complaintFormRef.current) {
      complaintFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Add at the top of your component
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }
  const messageRef = useRef(null);
  useEffect(() => {
    if (message) {
      // wait for DOM update then scroll message into view (center so it's visible)
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [message]);

const categoryKeywords = {
  "Water Issues": ["pipe", "leak", "water", "flood", "tap", "drain"],
  "Electricity": ["electricity", "power", "wires", "transformer", "light"],
  "Road Damages": ["road", "pothole", "crack", "asphalt", "manhole"],
  "Garbage Disposal": ["garbage", "trash", "dump", "waste", "bin"],
  "Other": []
};

function mapDetectedToCategory(detectedObjects) {
  detectedObjects = detectedObjects.map(obj => obj.toLowerCase());
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => detectedObjects.some(obj => obj.includes(kw)))) {
      return category;
    }
  }
  return "Other";
}

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!description || !category || !pickedLocation) {
    setMessage({ type: "error", text: "Please fill all required fields." });
    return;
  }

  try {
    setIsSubmitting(true);
    let detectedObjects = [];

    // Step 1: Run YOLO detection if an image is selected
    if (selectedFile) {
      const imageData = new FormData();
      imageData.append("image", selectedFile);

      const detectionResponse = await fetch("http://localhost:5000/api/yolo/detect", {
        method: "POST",
        body: imageData,
      });

      const text = await detectionResponse.text(); // get raw text

      if (!detectionResponse.ok) {
        console.error("YOLO response not OK:", text);
        throw new Error("YOLO detection failed");
      }

      try {
        const data = JSON.parse(text);

        // If backend returned array directly
        if (Array.isArray(data)) {
          detectedObjects = data.filter(cls => cls !== "all");
        }
        // If backend returned object with key
        else if (data.objects) {
          detectedObjects = data.objects.filter(cls => cls !== "all");
        }
      } catch (err) {
        console.error("Failed to parse YOLO JSON:", text);
        throw new Error("Invalid YOLO response format");
      }

      console.log("✅ YOLO detected objects:", detectedObjects);

      // Step 2: Map detected objects to category (top one)
      const topDetected = detectedObjects[0] || null;
      const detectedCategory = mapDetectedToCategory(topDetected ? [topDetected] : []);

      // Step 3: Ask for confirmation if mismatch
      if (topDetected && detectedCategory !== category) {
        const proceed = window.confirm(
          `The image seems to correspond to "${detectedCategory}" instead of your selected category "${category}". Do you still want to continue?`
        );
        if (!proceed) {
          setIsSubmitting(false);
          return;
        }
      }
    }

    // Step 4: Prepare final complaint submission
    const formData = new FormData();
    if (selectedFile) formData.append("file", selectedFile);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("visibility", visibility);
    formData.append("lat", pickedLocation.lat);
    formData.append("lng", pickedLocation.lng);
    formData.append("address", pickedLocation.name);
    formData.append("detectedObjects", JSON.stringify(detectedObjects));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.userId) formData.append("userId", storedUser.userId);

    // Step 5: Submit complaint
    const response = await fetch("http://localhost:5000/api/complaints/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage({ type: "error", text: data.message || "Submission failed." });
      setIsSubmitting(false);
      return;
    }

    setMessage({ type: "success", text: "Complaint submitted successfully!" });

    // Step 6: Reset form
    setSelectedFile(null);
    setCategory("");
    setDescription("");
    setPriority("High (Immediate danger/safety issue)");
    setVisibility("Public (Visible to everyone)");
    setPickedLocation(null);
    setIsSubmitting(false);

  } catch (err) {
    console.error("Full error:", err);
    setIsSubmitting(false);

    if (err instanceof TypeError) {
      setMessage({ type: "error", text: "Network error or server unreachable." });
    } else {
      setMessage({ type: "error", text: err.message || "Error detecting objects or submitting complaint." });
    }
  }
};




  return (
    <>
      <nav
        id="main-navbar"
        className={`sticky top-0 transition-all duration-300 container mx-auto px-12 py-6 flex justify-between items-center ${window.scrollY > 0
          ? "bg-slate-800 text-white [&_*]:text-white shadow-lg backdrop-blur bg-opacity-95"
          : "bg-white text-slate-900 shadow-sm"
          }`}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          minHeight: "90px",
          zIndex: 9999, // ensure navbar stays above map tiles/popups
        }}
      >
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src={logoImage}
            alt="Complaint ChainLK logo"
            className="w-40 h-14"
          />
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { path: "/home", label: "Home" },
            { path: "/complaint", label: "Complaints" },
            { path: "/contactus", label: "Contact Us" },
            { path: "/about", label: "About" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-lg font-semibold ${location.pathname === path
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-900 hover:text-blue-400 hover:border-b-2 hover:border-blue-400 transition"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <Link to="/cprofile">
            <img
              src={user}
              alt="User"
              className="w-12 h-12 rounded-full cursor-pointer"
            />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 text-slate-900 py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1
                style={{
                  fontFamily: '"Segoe UI", sans-serif',
                  fontWeight: 900,
                  fontSize: '80px',
                  lineHeight: '110%',
                  letterSpacing: 0,
                }}
                className="mb-6 text-blue-900 drop-shadow-lg"
              >
                Your Voice<br />Matters
              </h1>
              <p className="text-xl mb-10 font-medium max-w-lg leading-relaxed">
                Report public service issues and track their resolution in real-time with ease and transparency.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center gap-3"
                  onClick={() => complaintFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="text-xl" /> Submit Complaint
                </button>
                <Link to="/ComplaintTrack">
                  <button className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white shadow-md hover:shadow-xl transition duration-300 flex items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faSearch} className="text-xl" /> My Complaint
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
              <img
                src={ch}
                alt="Diverse citizens using smartphones"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16" style={{ background: "var(--light-color)" }}>
        <div className="grid md:grid-cols-3 gap-8 text-center px-4">
          {/* Step 1: Submit Complaint */}

          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-xl transition duration-300"> <div className="bg-gray-300 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full hover:bg-blue-500 transition duration-300"> <FontAwesomeIcon icon={faPlusCircle} className="text-xl text-gray-700 hover:text-white transition" /> </div> <h3 className="text-xl font-semibold mb-2 text-gray-800">Submit Complaint</h3> <p className="text-gray-600">Describe your issue, upload photos, and precisely pin the location on our interactive map.</p> </div>
          {/* Step 2: Track Progress */}

          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-xl transition duration-300"> <div className="bg-gray-300 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full hover:bg-blue-500 transition duration-300"> <FontAwesomeIcon icon={faSyncAlt} className="text-xl text-gray-700 hover:text-white transition" /> </div> <h3 className="text-xl font-semibold mb-2 text-gray-800">Track Progress</h3> <p className="text-gray-600">Receive real-time updates and stay informed as authorities work on resolving your complaint.</p> </div>
          {/* Step 3: Resolution */}

          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-xl transition duration-300"> <div className="bg-gray-300 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full hover:bg-blue-500 transition duration-300"> <FontAwesomeIcon icon={faCheckCircle} className="text-xl text-gray-700 hover:text-white transition" /> </div> <h3 className="text-xl font-semibold mb-2 text-gray-800">Resolution</h3> <p className="text-gray-600">Get notified when your issue is resolved and share your feedback for continuous improvement.</p> </div> </div>
      </section>

      {/* Complaint Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-900">Common Complaint Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: faTint, title: "Water Issues", desc: "Leakages, shortages, quality" },
              { icon: faBolt, title: "Electricity", desc: "Outages, safety hazards" },
              { icon: faRoad, title: "Road Damages", desc: "Potholes, traffic issues" },
              { icon: faTrash, title: "Garbage Disposal", desc: "Collection, dumping sites" },
              { icon: faTree, title: "Parks & Green Areas", desc: "Maintenance, facilities" },
              { icon: faBus, title: "Public Transport", desc: "Services, facilities, fares" },
              { icon: faBuildingIcon, title: "Public Buildings", desc: "Maintenance, accessibility" },
              { icon: faEllipsisH, title: "Other Issues", desc: "Not listed above" }
            ].map(({ icon, title, desc }, i) => (
              <Link key={i} to="/complaint" className="group">
                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl border border-transparent hover:border-blue-600 transition-all duration-300 cursor-pointer text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                    <FontAwesomeIcon icon={icon} className="text-blue-600 group-hover:text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-gray-800 group-hover:text-blue-700 transition">{title}</h3>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Resolved Complaints */}
      <section className="py-16" style={{ background: "var(--light-color)" }}>
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Recently Resolved Complaints</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="complaint-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition duration-300 hover:shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="status-badge status-resolved bg-green-100 text-green-700 px-2 rounded-full text-xs font-semibold">Resolved</span>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Water Leakage on Main Street</h3>
                <p className="text-gray-600 mb-4">
                  Major water pipe burst causing flooding on the road near the market area.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="avatar bg-blue-500 rounded-full w-9 h-9 flex items-center justify-center text-white font-semibold">RJ</div>
                    <div className="ml-2">
                      <p className="font-medium text-sm text-gray-800">Ramesh Jayasena</p>
                      <p className="text-xs text-gray-500">Colombo 05</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FontAwesomeIcon icon={faComments} />
                    <span className="text-xs ml-1">4</span>
                  </div>
                </div>
              </div>
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img
                  src="https://placehold.co/400x200"
                  alt="Water gushing out from a broken pipe on a city street with people gathered around"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="complaint-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition duration-300 hover:shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="status-badge status-resolved bg-green-100 text-green-700 px-2 rounded-full text-xs font-semibold">Resolved</span>
                  <span className="text-sm text-gray-500">5 days ago</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Garbage Not Collected</h3>
                <p className="text-gray-600 mb-4">
                  Garbage hasn't been collected for over a week in the housing complex.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="avatar bg-green-500 rounded-full w-9 h-9 flex items-center justify-center text-white font-semibold">SP</div>
                    <div className="ml-2">
                      <p className="font-medium text-sm text-gray-800">Samantha Perera</p>
                      <p className="text-xs text-gray-500">Kandy</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FontAwesomeIcon icon={faComments} />
                    <span className="text-xs ml-1">7</span>
                  </div>
                </div>
              </div>
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img
                  src="https://placehold.co/400x200"
                  alt="Overflowing garbage bins in a residential area with bags piled up on the sidewalk"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="complaint-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition duration-300 hover:shadow-lg">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="status-badge status-resolved bg-green-100 text-green-700 px-2 rounded-full text-xs font-semibold">Resolved</span>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Dangerous Pothole</h3>
                <p className="text-gray-600 mb-4">
                  Large pothole near the school causing traffic issues and danger to students.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="avatar bg-purple-500 rounded-full w-9 h-9 flex items-center justify-center text-white font-semibold">NT</div>
                    <div className="ml-2">
                      <p className="font-medium text-sm text-gray-800">Nimal Thilak</p>
                      <p className="text-xs text-gray-500">Galle</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <FontAwesomeIcon icon={faComments} />
                    <span className="text-xs ml-1">3</span>
                  </div>
                </div>
              </div>
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img
                  src="https://placehold.co/400x200"
                  alt="Deep pothole in the middle of a busy road with vehicles driving around it"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/complaint">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition">
                View All Complaints
              </button>
            </Link>
          </div>
        </div>
      </section>

<section id="complaintSubmission" ref={complaintFormRef} className="py-16 bg-gray-100">
  <div className="container mx-auto px-12">
    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
      Submit a Complaint in 3 Easy Steps
    </h2>

    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="p-1 bg-gray-600"></div>
      <div className="p-6 md:p-8">
        {message && (
          <div
            ref={messageRef}
            className={`mb-4 px-4 py-3 rounded shadow ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
            role="alert"
          >
            <div className="flex items-start justify-between">
              <div className="text-sm">{message.text}</div>
              <button
                className="ml-4 font-bold text-sm"
                onClick={() => setMessage(null)}
                aria-label="close message"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <FileUpload onFileSelect={(file) => setSelectedFile(file)} />

          {/* Category */}
          <div className="mb-8 mt-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
              Select Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              <option>Water Issues</option>
              <option>Electricity</option>
              <option>Road Damages</option>
              <option>Garbage Disposal</option>
              <option>Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Describe Your Complaint
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 h-32"
              placeholder="Please provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Location */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <LocationPicker
              selectedLocation={pickedLocation}
              onPick={(loc) =>
                setPickedLocation({
                  lat: Number(loc.lat),
                  lng: Number(loc.lng),
                  name: loc.name || "",
                })
              }
            />
            <div className="mt-4">
              <AddressAutocomplete
                value={pickedLocation?.name || ""}
                onSelect={(loc) =>
                  setPickedLocation({
                    lat: Number(loc.lat),
                    lng: Number(loc.lng),
                    name: loc.name || "",
                  })
                }
                placeholder="Search for a location"
              />
            </div>
            {pickedLocation && (
              <p className="text-gray-600 mt-2">
                Selected: <strong>{pickedLocation.name || "Unnamed location"}</strong> (
                {pickedLocation.lat.toFixed(4)}, {pickedLocation.lng.toFixed(4)})
              </p>
            )}
            <input
              type="text"
              className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter exact address or landmark"
              value={pickedLocation?.name || ""}
              onChange={(e) =>
                setPickedLocation((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {/* Priority & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>High (Immediate danger/safety issue)</option>
                <option>Medium (Significant inconvenience)</option>
                <option>Low (Minor issue)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="visibility">
                Visibility
              </label>
              <select
                id="visibility"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option>Public (Visible to everyone)</option>
                <option>Private (Only visible to authorities)</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-end">
            <button
  type="submit"
  className="bg-gray-700 text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition"
  disabled={isSubmitting}
>
  {isSubmitting ? "Detecting & Submitting..." : "Submit Complaint"}
</button>

          </div>
        </form>
      </div>
    </div>
  </div>
</section>


      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-12">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Complaint ChainLK</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Citizens */}
            <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center">
              <FontAwesomeIcon icon={faUserCheck} className="text-4xl mb-6 text-gray-700" />
              <h3 className="text-xl font-semibold mb-4 text-center">For Citizens</h3>
              <ul className="space-y-3 text-gray-700 list-inside list-disc">
                <li>Easy submission anytime, anywhere</li>
                <li>Real-time tracking of complaint status</li>
                <li>Transparent communication with authorities</li>
                <li>Community collaboration options</li>
              </ul>
            </div>
            {/* For Authorities */}
            <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center">
              <FontAwesomeIcon icon={faBuildingIcon} className="text-4xl mb-6 text-gray-700" />
              <h3 className="text-xl font-semibold mb-4 text-center">For Authorities</h3>
              <ul className="space-y-3 text-gray-700 list-inside list-disc">
                <li>Centralized dashboard for complaint management</li>
                <li>Automated status updates and notifications</li>
                <li>Data-driven insights for better resource allocation</li>
                <li>Improved public trust and transparency</li>
              </ul>
            </div>
            {/* For Community */}
            <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center">
              <FontAwesomeIcon icon={faUsers} className="text-4xl mb-6 text-gray-700" />
              <h3 className="text-xl font-semibold mb-4 text-center">For Community</h3>
              <ul className="space-y-3 text-gray-700 list-inside list-disc">
                <li>Collective action for faster resolutions</li>
                <li>Public visibility of common issues</li>
                <li>Encourages civic engagement</li>
                <li>Builds a stronger, safer community</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/90 text-white py-10">
        <div className="max-w-4xl mx-auto px-12 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            {/* Logo and Description */}
            <div className="md:w-1/3">
              <div className="flex items-center mb-3">
                <img
                  src={logoImage}
                  alt="Complaint ChainLK logo"
                  className="w-12 h-12"
                />
              </div>
              <p className="text-xs leading-relaxed">
                Empowering citizens and authorities to resolve public service issues efficiently, transparently, and collaboratively across Sri Lanka.
              </p>
            </div>
            {/* Quick Links */}
            <div className="md:w-1/3">
              <h4 className="font-semibold text-base mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {["home", "complaint", "contactus", "about"].map((path, i) => (
                  <li key={i}>
                    <Link
                      to={`/${path}`}
                      className={`text-white hover:text-gray-300 transition text-sm font-medium`}
                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Social & Contact */}
            <div className="md:w-1/3">
              <h4 className="font-semibold text-base mb-3">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
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
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-white select-none">
            &copy; 2025 Complaint ChainLK. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default ComplaintChainLK;
