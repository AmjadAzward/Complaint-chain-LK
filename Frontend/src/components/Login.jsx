import React, { useState } from "react";
import logoImage from "../images/logo1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/citizen/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store JWT & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setError("");
      setSuccess("Login successful! Redirecting...");

      // Redirection based on admin or normal user
      setTimeout(() => {
        if (email === "admin@gmail.com" && password === "admin123") {
          navigate("/adminhome");
        } else {
          navigate("/home");
        }
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
      setSuccess("");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{ background: "linear-gradient(135deg, #e0e5ec, #f7f9fc)" }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <img src={logoImage} alt="Logo" className="w-20 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none shadow-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="text-left relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none shadow-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-medium text-white transition-all duration-300"
            style={{ backgroundColor: "#004aad" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#003a85")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#004aad")}
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
