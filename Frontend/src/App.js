import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Citizen/Home";
import About from "./components/Citizen/About";
import ContactUs from "./components/Citizen/ContactUs";
import ComplaintTrack from "./components/Citizen/ComplaintTrack";
import Complaint from "./components/Citizen/Complaints";
import LocationTrack from "./components/Citizen/LocationPicker";

import AuthHome from "./components/Auth/AuthHome";
import AuthAlerts from "./components/Auth/AuthAlerts";
import AuthAnalytics from "./components/Auth/AuthAnalytics";
import AuthComplaints from "./components/Auth/AuthComplaints";

import AdminHome from "./components/Admin/AdminHome";
import AdminAuth from "./components/Admin/AdminAuth";
import AdminCitizen from "./components/Admin/AdminCitizen";
import AdminReport from "./components/Admin/AdminReport";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Cprofile from "./components/Cprofile";
import ForgotPassword from "./components/ForgotPassword";
import FileUpload from "./components/Citizen/FileUpload";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Citizen Routes (Protected) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cprofile"
          element={
            <ProtectedRoute>
              <Cprofile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contactus"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complainttrack"
          element={
            <ProtectedRoute>
              <ComplaintTrack />
            </ProtectedRoute>
          }
        />

        {/* Auth Routes (Protected) */}
        <Route
          path="/authhome"
          element={
            <ProtectedRoute>
              <AuthHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authalerts"
          element={
            <ProtectedRoute>
              <AuthAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authanalytics"
          element={
            <ProtectedRoute>
              <AuthAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authcomplaints"
          element={
            <ProtectedRoute>
              <AuthComplaints />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Protected) */}
        <Route
          path="/adminhome"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminauth"
          element={
            <ProtectedRoute>
              <AdminAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admincitizen"
          element={
            <ProtectedRoute>
              <AdminCitizen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminreport"
          element={
            <ProtectedRoute>
              <AdminReport />
            </ProtectedRoute>
          }
        />
        <Route path="/file-upload" element={<FileUpload />} />
        <Route path="/locationPick" element={<LocationTrack />} />

      </Routes>
    </Router>
  );
}

export default App;
