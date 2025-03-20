import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { API_URL } from "../../../apiPath/apiPath";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false); // ✅ Spinner state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);

        setUsername("");
        setEmail("");
        setPassword("");
        setSuccess("Vendor registered successfully ✅");

        setShowSpinner(true); // ✅ Show spinner
        setTimeout(() => {
          setShowSpinner(false);
          navigate("/login");
        }, 2000); // ✅ Wait 2 seconds before redirecting
      } else {
        setError(data.message || "Vendor Emaild already Regstered");
      }
    } catch (error) {
      console.error(error);
      setError("Network error. Please try again ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-register">
      {showSpinner && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`register-container ${showSpinner ? "blurred" : ""}`}>
        <h2>Vendor Register</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
