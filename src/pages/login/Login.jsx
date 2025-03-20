import React, { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import "./login.css";
import { API_URL } from "../../../apiPath/apiPath";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        setEmail("");
        setPassword("");
        setSuccess(data.message || "Vendor logged in successfully ✅");

        // Save login token
        localStorage.setItem("loginToken", data.token);
        setIsAuthenticated(true); // ✅ Update authentication state

        if (data.vendorId) {
          console.log("Fetching vendor details for ID:", data.vendorId);
          const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${data.vendorId}`);
          const vendorData = await vendorResponse.json();

          if (vendorResponse.ok) {
            localStorage.setItem("firmId", vendorData.vendorFirmId);
            localStorage.setItem("firmName", vendorData.vendor?.Firms?.[0]?.firmName || "Unknown Firm");
          }
        }

        // Redirect to Home after showing spinner
        setShowSpinner(true);
        setTimeout(() => {
          setShowSpinner(false);
          navigate("/home");
        }, 1500);
      } else {
        setError(data.message || "Invalid username or password ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Internal server error. Please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-login">
      {showSpinner && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`login-container ${showSpinner ? "blurred" : ""}`}>
        <h2>Vendor Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="auth-text">
      Don't have an account? <Link to="/register" className="auth-link">Register</Link>
    </p>
      </div>
    </div>
  );
};

export default Login;
