import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState("request"); // request | verify | reset | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let t;
    if (resendTimer > 0) {
      t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [resendTimer]);

  const requestOtp = async (e) => {
    e && e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: "error", text: "Enter a valid email." });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setLoading(false);
      if (res.data && res.data.ok) {
        setMessage({ type: "success", text: "OTP sent to your email." });
        setStep("verify");
        setResendTimer(60); // 60s cool-down for resend
      } else {
        setMessage({ type: "error", text: res.data?.message || "Failed to send OTP." });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: err.response?.data?.message || "Request failed." });
    }
  };

  const verifyOtp = async (e) => {
    e && e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!otp || otp.trim().length === 0) {
      setMessage({ type: "error", text: "Enter the OTP." });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setLoading(false);
      if (res.data && res.data.ok) {
        setMessage({ type: "success", text: "OTP verified. Set a new password." });
        setStep("reset");
      } else {
        setMessage({ type: "error", text: res.data?.message || "OTP invalid." });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: err.response?.data?.message || "Verification failed." });
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setLoading(false);
      if (res.data && res.data.ok) {
        setMessage({ type: "success", text: "OTP resent to your email." });
        setResendTimer(60);
      } else {
        setMessage({ type: "error", text: res.data?.message || "Resend failed." });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: err.response?.data?.message || "Resend failed." });
    }
  };

  const resetPassword = async (e) => {
    e && e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!newPassword || newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setLoading(false);
      if (res.data && res.data.ok) {
        setMessage({ type: "success", text: "Password changed successfully." });
        setStep("done");
        // optional: redirect to login after short delay
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        setMessage({ type: "error", text: res.data?.message || "Reset failed." });
      }
    } catch (err) {
      setLoading(false);
      setMessage({ type: "error", text: err.response?.data?.message || "Reset failed." });
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "3rem auto", padding: 20, background: "#fff", borderRadius: 12 }}>
      <h2 style={{ marginTop: 0 }}>Forgot Password</h2>

      {message.text && (
        <div style={{ padding: 10, borderRadius: 6, marginBottom: 12, background: message.type === "success" ? "#e8f5e9" : "#fdecea", color: message.type === "success" ? "#2e7d32" : "#b71c1c" }}>
          {message.text}
        </div>
      )}

      {step === "request" && (
        <form onSubmit={requestOtp}>
          <label style={{ display: "block", marginBottom: 8 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: 8, marginBottom: 12 }} />
          <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>{loading ? "Sending..." : "Send OTP"}</button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={verifyOtp}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
            <label style={{ display: "block", marginBottom: 6 }}>OTP</label>
            <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>{loading ? "Verifying..." : "Verify OTP"}</button>
            <button type="button" onClick={resendOtp} disabled={resendTimer > 0 || loading} style={{ padding: "8px 12px" }}>
              {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"}
            </button>
            <button type="button" onClick={() => setStep("request")} style={{ padding: "8px 12px" }}>Back</button>
          </div>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={resetPassword}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>New password</label>
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Min 8 characters" style={{ width: "100%", padding: 8, marginBottom: 8 }} />
            <label style={{ display: "block", marginBottom: 6 }}>Confirm password</label>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>{loading ? "Saving..." : "Change password"}</button>
            <button type="button" onClick={() => setStep("verify")} style={{ padding: "8px 12px" }}>Back</button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div>
          <p>Password updated. Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}