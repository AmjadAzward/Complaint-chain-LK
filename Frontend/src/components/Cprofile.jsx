import React, { useState, useEffect } from "react";
import logoImage from "../images/logo1.png";
import { FaEye, FaCamera } from "react-icons/fa";
import axios from "axios";

export default function CompleteProfile() {
  const [photo, setPhoto] = useState(null);
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverUpload, setHoverUpload] = useState(false);
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    gender: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const userId = localStorage.getItem("userId");

  const styles = {
    background: {
      background: "linear-gradient(135deg, #e0e5ec, #f7f9fc)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    container: {
      backgroundColor: "#fff",
      borderRadius: "18px",
      padding: "3rem",
      maxWidth: "900px",
      width: "100%",
      boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
      boxSizing: "border-box",
    },
    logoContainer: { display: "flex", alignItems: "center", marginBottom: "2rem" },
    logo: { height: "60px" },
    title: { fontWeight: 700, fontSize: "1.8rem", marginBottom: "0.5rem", color: "#2E3A59" },
    subtitle: { color: "#777", marginBottom: "2rem" },
    formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", columnGap: "2rem", rowGap: "1rem" },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "1rem",
      outline: "none",
      transition: "0.3s",
    },
    inputError: {
      border: "1px solid #e53e3e",
      boxShadow: "0 0 0 3px rgba(229,62,62,0.06)"
    },
    passwordWrapper: { position: "relative" },
    eyeIcon: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "1.2rem",
      cursor: "pointer",
      color: "#777",
    },
    genderWrapper: { display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "0.5rem" },
    uploadBox: {
      width: "170px",
      height: "170px",
      border: "1.5px dashed #ccc",
      borderRadius: "12px",
      background: "#fafafa",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#aaa",
      fontSize: "0.9rem",
      cursor: "pointer",
      overflow: "hidden",
      marginBottom: "1rem",
      transition: "0.3s",
    },
    uploadHover: { borderColor: "#3c4a5e", color: "#3c4a5e" },
    buttons: { marginTop: "2.5rem", display: "flex", gap: "1rem" },
    saveButton: { flex: 1, backgroundColor: "#3c4a5e", padding: "0.85rem", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", transition: "all 0.3s ease" },
    saveButtonHover: { backgroundColor: "#2e3848", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
    logoutButton: { flex: 1, backgroundColor: "#e16538", padding: "0.85rem", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", transition: "all 0.3s ease" },
    logoutButtonHover: { backgroundColor: "#c14c1f", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
    messageBox: { padding: "12px", borderRadius: "6px", marginBottom: "16px", textAlign: "center", fontWeight: "500", fontSize: "0.9rem" },
    successMsg: { backgroundColor: "#e8f5e9", color: "#2e7d32" },
    errorMsg: { backgroundColor: "#fdecea", color: "#b71c1c" },
    errorText: { color: "#e53e3e", fontSize: "0.85rem", marginTop: "6px" },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modalBox: {
      background: "#fff",
      padding: "1.25rem",
      borderRadius: "10px",
      width: "420px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    },
    modalInput: {
      width: "100%",
      padding: "0.6rem 0.8rem",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginTop: "0.5rem",
    },
    modalBtn: {
      marginTop: "0.75rem",
      padding: "0.6rem 0.9rem",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/citizen/${userId}`);
        const data = res.data;
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          nic: data.nic || "",
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
          street: data.street || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          password: data.password || "",
        });
        if (data.photoURL) setPhoto(data.photoURL);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const validateField = (name, value) => {
    let msg = "";
    const v = (value || "").toString().trim();
    switch (name) {
      case "firstName":
      case "lastName":
        if (!v) msg = "This field is required.";
        break;
      case "nic":
        if (!v) msg = "NIC is required.";
        else if (v.length < 5) msg = "NIC looks too short.";
        break;
      case "email":
        if (!v) msg = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(v)) msg = "Invalid email address.";
        break;
      case "phone":
        if (!v) msg = "Phone is required.";
        else if (!/^\+?\d{7,15}$/.test(v)) msg = "Invalid phone number.";
        break;
      case "street":
      case "city":
        if (!v) msg = "This field is required.";
        break;
      case "postalCode":
        if (!v) msg = "Postal code is required.";
        else if (!/^\d{4,6}$/.test(v)) msg = "Invalid postal code.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const validateAll = () => {
    const required = ["firstName", "lastName", "nic", "email", "phone", "street", "city", "postalCode"];
    let ok = true;
    required.forEach((field) => {
      const value = formData[field];
      const valid = validateField(field, value);
      if (!valid) ok = false;
    });
    return ok;
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const nextValue = value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    validateField(name, nextValue);
    if (["nic", "email", "phone"].includes(name)) {
      try {
        if (!nextValue) return;
        const res = await axios.post(`http://localhost:5000/api/citizen/check-${name}`, { [name]: nextValue, userId });
        if (res.data.exists) {
          setServerMessage({ type: "error", text: `${name.toUpperCase()} already exists!` });
        } else {
          if (serverMessage.type === "error") setServerMessage({ type: "", text: "" });
        }
      } catch (err) { console.error(err); }
    }
  };

  const handlePasswordEditAttempt = (e) => {
    e.preventDefault();
    setVerifyError("");
    setCurrentPasswordInput("");
    setShowVerifyModal(true);
  };

  const handleVerifySubmit = async (ev) => {
    ev.preventDefault();
    setVerifyError("");
    try {
      const res = await axios.post(`http://localhost:5000/api/citizen/verify-password`, { userId, password: currentPasswordInput });
      if (res.data && res.data.ok) {
        setShowVerifyModal(false);
        setIsEditingPassword(true);
        setServerMessage({ type: "success", text: "Current password verified — enter new password." });
      } else {
        setVerifyError("Current password does not match. You can reset it via Forgot Password.");
      }
    } catch (err) {
      console.error(err);
      setVerifyError("Verification failed. Try again or use Forgot Password.");
    }
  };

  // validate password fields and set per-field errors
  const validatePasswordFields = () => {
    const newErrors = {};
    let ok = true;
    if (isEditingPassword) {
      if (!newPassword || newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters.";
        ok = false;
      } else {
        newErrors.newPassword = "";
      }
      if (confirmPassword !== newPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
        ok = false;
      } else {
        newErrors.confirmPassword = "";
      }
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
    return ok;
  };

  const handleNewPasswordChange = (e) => {
    const v = e.target.value;
    setNewPassword(v);
    // live-validate
    setErrors((prev) => ({
      ...prev,
      newPassword: v && v.length >= 8 ? "" : "New password must be at least 8 characters.",
      confirmPassword: confirmPassword && confirmPassword === v ? "" : (confirmPassword ? "Passwords do not match." : prev.confirmPassword)
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const v = e.target.value;
    setConfirmPassword(v);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: v === newPassword ? "" : "Passwords do not match."
    }));
  };

  // change password immediately (separate button under confirm field)
const handleChangePassword = async () => {
  setServerMessage({ type: "", text: "" });
  setPasswordSuccess("");

  // Validate password fields
  const newErrors = {};
  if (!newPassword || newPassword.length < 8) {
    newErrors.newPassword = "New password must be at least 8 characters.";
  }
  if (confirmPassword !== newPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(newErrors).length) {
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/citizen/change-password", {
      userId,
      currentPassword: currentPasswordInput,
      newPassword,
      confirmPassword,
    });

    if (res.data) {
      setServerMessage({ type: "success", text: res.data.message || "Password changed successfully." });

      // Reset password fields and editing state
      setIsEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordInput("");
      setErrors((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setPasswordSuccess("");

      // Now the initial helper text will appear again
    } else {
      setServerMessage({ type: "error", text: res.data?.message || "Password change failed." });
    }
  } catch (err) {
    setServerMessage({ type: "error", text: err.response?.data?.message || "Password change failed." });
  }
};


  const handleSave = async (e) => {
    e.preventDefault();
    setServerMessage({ type: "", text: "" });
    if (!validateAll()) {
      setServerMessage({ type: "error", text: "Please fix validation errors before saving." });
      return;
    }
    if (isEditingPassword) {
      // use per-field validation (shows errors under inputs)
      if (!validatePasswordFields()) {
        // focus first password error field if desired
        return;
      }
    }
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "password") return;
      payload.append(key, value);
    });
    if (photo && photo instanceof File) payload.append("photo", photo);
    if (isEditingPassword) payload.append("password", newPassword);

    try {
      const response = await axios.put(`http://localhost:5000/api/citizen/update/${userId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setServerMessage({ type: "success", text: response.data.message || "Profile updated!" });
      setShowSuccessModal(true);
      if (isEditingPassword) {
        setIsEditingPassword(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setServerMessage({ type: "error", text: error.response?.data?.message || "Update failed" });
    }
  };

  const requiredFields = ["firstName", "lastName", "nic", "email", "phone", "street", "city", "postalCode"];
  const isFormFilled = requiredFields.every((f) => (formData[f] || "").toString().trim() !== "");
  const hasErrors = Object.values(errors).some((v) => v && v.length > 0);
  const isFormValid = isFormFilled && !hasErrors;

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        {/* Header and upload */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem" }}>
          <div style={{ flex: 2 }}>
            <div style={styles.logoContainer}><img src={logoImage} alt="Logo" style={styles.logo} /></div>
            <h2 style={styles.title}>Complete Your Profile</h2>
            <p style={styles.subtitle}>Enter your personal information to continue</p>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ ...styles.uploadBox, ...(hoverUpload ? styles.uploadHover : {}) }}
              onMouseEnter={() => setHoverUpload(true)} onMouseLeave={() => setHoverUpload(false)}>
              {photo ? (typeof photo === "string" ? <img src={photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <img src={URL.createObjectURL(photo)} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />)
                : (<><FaCamera size={42} style={{ marginBottom: 10 }} />Upload your photo</>)}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setPhoto(e.target.files[0])} />
            </label>
          </div>
        </div>

        {serverMessage.text && !showSuccessModal && (
          <div style={{ ...styles.messageBox, ...(serverMessage.type === "success" ? styles.successMsg : styles.errorMsg) }}>
            {serverMessage.text}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={styles.formGrid}>
            {/* Form fields (firstName, lastName, NIC, etc.) */}
            <div><input style={{ ...styles.input, ...(errors.firstName ? styles.inputError : {}) }} name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
              {errors.firstName && <div style={styles.errorText}>{errors.firstName}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.nic ? styles.inputError : {}) }} name="nic" value={formData.nic} onChange={handleInputChange} placeholder="NIC Number" />
              {errors.nic && <div style={styles.errorText}>{errors.nic}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.lastName ? styles.inputError : {}) }} name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
              {errors.lastName && <div style={styles.errorText}>{errors.lastName}</div>}</div>

            <div style={styles.genderWrapper}>
              <label>Gender
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleInputChange} style={{ marginLeft: "0.5rem" }} /> Male
              </label>
              <label>
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleInputChange} style={{ marginLeft: "0.5rem" }} /> Female
              </label>
            </div>

            <div><input style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }} name="email" value={formData.email} onChange={handleInputChange} placeholder="Email address" />
              {errors.email && <div style={styles.errorText}>{errors.email}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }} name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
              {errors.phone && <div style={styles.errorText}>{errors.phone}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.street ? styles.inputError : {}) }} name="street" value={formData.street} onChange={handleInputChange} placeholder="Street Address" />
              {errors.street && <div style={styles.errorText}>{errors.street}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }} name="city" value={formData.city} onChange={handleInputChange} placeholder="City / Town" />
              {errors.city && <div style={styles.errorText}>{errors.city}</div>}</div>

            <div><input style={{ ...styles.input, ...(errors.postalCode ? styles.inputError : {}) }} name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" />
              {errors.postalCode && <div style={styles.errorText}>{errors.postalCode}</div>}</div>

            {/* Password area: read-only hashed password until user verifies current password */}
            <div style={styles.passwordWrapper}>
              {!isEditingPassword ? (
                <>
                  <input
                    style={styles.input}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={""} // always empty on load
                    readOnly
                    placeholder="********"
                    onFocus={handlePasswordEditAttempt}
                    onClick={handlePasswordEditAttempt}
                  />
                  <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "6px" }}>
                    Click the password field to change password (you will be asked to verify current password).
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <input
                      style={{ ...styles.input, marginBottom: 6 }}
                      name="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      placeholder="New password (min 8 chars)"
                    />
                    {errors.newPassword && <div style={styles.errorText}>{errors.newPassword}</div>}
                  </div>
                  <div>
                    <input
                      style={styles.input}
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}

                    {/* separate button to change password immediately */}
                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={!newPassword || newPassword.length < 8 || newPassword !== confirmPassword}
                        style={{
                          padding: "0.6rem 0.8rem",
                          borderRadius: 6,
                          border: "none",
                          background: (!newPassword || newPassword.length < 8 || newPassword !== confirmPassword) ? "#ccc" : "#3c4a5e",
                          color: "#fff",
                          cursor: (!newPassword || newPassword.length < 8 || newPassword !== confirmPassword) ? "not-allowed" : "pointer",
                          width: "100%",
                          marginTop: 8
                        }}
                      >
                        Change Password
                      </button>
                    </div>

                    {/* inline success message (green) below the confirm field */}
                    {passwordSuccess && (
                      <div style={{ ...styles.messageBox, ...styles.successMsg, marginTop: 8, padding: "6px" }}>
                        {passwordSuccess}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Verify current password modal */}
            {showVerifyModal && (
              <div style={styles.modalOverlay} onClick={() => setShowVerifyModal(false)}>
                <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ margin: 0 }}>Verify current password</h3>
                  <p style={{ marginTop: 6, color: "#555", fontSize: "0.95rem" }}>
                    Enter your current password to confirm before changing it.
                  </p>
                  {/* avoid nested form submission by not using a <form> inside the parent form */}
                  <div>
                    <input
                      style={styles.modalInput}
                      type="password"
                      placeholder="Current password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleVerifySubmit(e); }
                      }}
                    />
                    {verifyError && <div style={{ color: "#e53e3e", marginTop: 8 }}>{verifyError}</div>}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        type="button"
                        style={{ ...styles.modalBtn, background: "#3c4a5e", color: "#fff", flex: 1 }}
                        onClick={handleVerifySubmit}
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        style={{ ...styles.modalBtn, background: "#eee", color: "#333", flex: 1 }}
                        onClick={() => (window.location.href = "/forgot-password")}
                      >
                        Forgot Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div style={styles.buttons}>
            <button type="submit" style={{ ...styles.saveButton, ...(hoverSave ? styles.saveButtonHover : {}) }}
              onMouseEnter={() => setHoverSave(true)} onMouseLeave={() => setHoverSave(false)}
              disabled={!isFormValid}>
              Save Changes
            </button>

            <button type="button" style={{ ...styles.logoutButton, ...(hoverLogout ? styles.logoutButtonHover : {}) }}
              onMouseEnter={() => setHoverLogout(true)} onMouseLeave={() => setHoverLogout(false)}
              onClick={() => window.location.href = "/logout"}>
              Logout
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div style={styles.modalOverlay} onClick={() => setShowSuccessModal(false)}>
            <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <h3>Profile Updated!</h3>
              <p style={{ marginTop: 6, color: "#555", fontSize: "0.95rem" }}>
                Your profile was updated successfully. Do you want to go to the home page?
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  style={{ ...styles.modalBtn, background: "#3c4a5e", color: "#fff", flex: 1 }}
                  onClick={() => (window.location.href = "/home")}
                >
                  Yes, Go Home
                </button>
                <button
                  type="button"
                  style={{ ...styles.modalBtn, background: "#eee", color: "#333", flex: 1 }}
                  onClick={() => setShowSuccessModal(false)}
                >
                  Stay Here
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
