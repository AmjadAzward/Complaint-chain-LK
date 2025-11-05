import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../images/logo1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  background: {
    background: "linear-gradient(135deg, #d7dbe0, #f0f2f5)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "32px 36px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  logo: { marginBottom: "14px", textAlign: "center" },
  logoImg: { height: "80px", width: "80px", margin: "0 auto" },
  header: {
    fontWeight: "700",
    fontSize: "1.7rem",
    textAlign: "center",
    marginBottom: "6px",
    color: "#2E3A59",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#777",
    textAlign: "center",
    marginBottom: "18px",
  },
  inputWrapper: { position: "relative", marginBottom: "18px" },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#777",
  },
  signUpButton: {
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    fontWeight: "600",
    background: "#3c4a5e",
    borderRadius: "8px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "5px",
    transition: "all 0.3s ease",
  },
  signUpButtonHover: {
    background: "#2e3848",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  messageBox: {
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "12px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  errorMsg: { backgroundColor: "#fdecea", color: "#b71c1c" },
  successMsg: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
  bottomText: { textAlign: "center", fontSize: "0.9rem", marginTop: "12px" },
  link: {
    color: "#1976d2",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "4px",
  },
  availabilityText: { fontSize: "0.8rem", marginTop: "4px" },
};

function CitizenSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });
  const [hoverButton, setHoverButton] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const navigate = useNavigate();
  let emailCheckTimeout;

  const validate = (values) => {
    const errs = {};
    if (!values.firstName.trim()) errs.firstName = "First name is required";
    if (!values.lastName.trim()) errs.lastName = "Last name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email) errs.email = "Email is required";
    else if (!emailRegex.test(values.email)) errs.email = "Invalid email address";
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!values.password) errs.password = "Password is required";
    else if (!passwordRegex.test(values.password))
      errs.password =
        "Password must be 8+ chars, include a number & special char";
    if (!values.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (values.password !== values.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerMessage({ type: "", text: "" });

    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && emailAvailable !== false) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/citizen/signup",
          formData
        );
        if (response.status === 201) {
          localStorage.setItem("userId", response.data.userId);
          setServerMessage({
            type: "success",
            text: "Signup successful! Redirecting...",
          });
          setTimeout(() => navigate("/cprofile"), 1500);
        }
      } catch (error) {
        setServerMessage({
          type: "error",
          text: error.response?.data?.message || "Signup failed",
        });
      }
    } else if (emailAvailable === false) {
      setServerMessage({ type: "error", text: "Email is already taken." });
    }
  };

  const checkEmailAvailability = (email) => {
    clearTimeout(emailCheckTimeout);
    if (!email) {
      setEmailAvailable(null);
      return;
    }

    emailCheckTimeout = setTimeout(async () => {
      try {
        setCheckingEmail(true);
        const response = await axios.post(
          "http://localhost:5000/api/citizen/check-email",
          { email }
        );
        setEmailAvailable(response.data.available);
        setCheckingEmail(false);
      } catch (error) {
        setEmailAvailable(null);
        setCheckingEmail(false);
      }
    }, 500);
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: errors[field]
      ? "#f44336"
      : emailAvailable && field === "email"
      ? "#2e7d32"
      : "#ccc",
    boxShadow: errors[field]
      ? "0 0 6px rgba(244,67,54,0.3)"
      : emailAvailable && field === "email"
      ? "0 0 6px rgba(46,125,50,0.3)"
      : "none",
    transition: "all 0.3s ease",
  });

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img
            src={logoImage}
            alt="Logo"
            style={styles.logoImg}
          />
        </div>

        <div style={styles.header}>Create Your Account</div>
        <div style={styles.subtitle}>Please fill in the details to get started</div>

        {serverMessage.text && (
          <div
            style={{
              ...styles.messageBox,
              ...(serverMessage.type === "error"
                ? styles.errorMsg
                : styles.successMsg),
            }}
          >
            {serverMessage.text}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div style={styles.inputWrapper}>
            <input
              style={inputStyle("firstName")}
              name="firstName"
              type="text"
              placeholder="First name"
            />
            {errors.firstName && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={inputStyle("lastName")}
              name="lastName"
              type="text"
              placeholder="Last name"
            />
            {errors.lastName && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.lastName}
              </div>
            )}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={inputStyle("email")}
              name="email"
              type="email"
              placeholder="Email address"
              onChange={(e) => checkEmailAvailability(e.target.value)}
            />
            {errors.email && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.email}
              </div>
            )}
            {!errors.email && checkingEmail && (
              <div style={{ color: "#777", fontSize: "0.8rem", marginTop: "4px" }}>
                Checking...
              </div>
            )}
            {!errors.email && emailAvailable === false && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                Email already taken
              </div>
            )}
            {!errors.email && emailAvailable === true && (
              <div style={{ color: "#2e7d32", fontSize: "0.8rem", marginTop: "4px" }}>
                Email available!
              </div>
            )}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={inputStyle("password")}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={styles.inputWrapper}>
            <input
              style={inputStyle("confirmPassword")}
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
            />
            <span
              style={styles.eyeIcon}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <div style={{ color: "#f44336", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            style={{
              ...styles.signUpButton,
              ...(hoverButton ? styles.signUpButtonHover : {}),
            }}
            type="submit"
            onMouseEnter={() => setHoverButton(true)}
            onMouseLeave={() => setHoverButton(false)}
          >
            Sign up
          </button>
        </form>

        <div style={styles.bottomText}>
          Already have an account?
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CitizenSignup;
