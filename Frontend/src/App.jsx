import React from "react";
    import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
    import Home from "./components/Home";
    import Login from "./components/Login";
    import Signup from "./components/Signup";
    import Cprofilr from "./components/Cprofile";
    import Complaints from "./components/Citizen/Complaints"; 
    import ForgotPassword from "./components/ForgotPassword";
    import FileUpload from "./components/Citizen/FileUpload"; 


    export default function App() {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />     
            <Route path="/signup" element={<Signup />} />
            <Route path="/complaint" element={<Complaints />} /> 
            <Route path="/cprofile" element={<Cprofilr />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/file-upload" element={<FileUpload />} />

          </Routes>
        </Router>
      );
    }
