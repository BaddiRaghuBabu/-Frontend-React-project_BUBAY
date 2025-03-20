import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loginToken"));
  const [firmName, setFirmName] = useState(localStorage.getItem("firmName") || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Auto-Update Login Status When Storage Changes
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("loginToken"));
      setFirmName(localStorage.getItem("firmName") || "");
    };

    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoggingOut(true);

        setTimeout(() => {
          localStorage.removeItem("loginToken");
          localStorage.removeItem("firmName");
          setIsLoggedIn(false);
          setFirmName("");
          setIsLoggingOut(false);
          navigate("/login");
        }, 1000);
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">🍽️ Vendor Portal</Link>

        {isLoggedIn && (
          <span className="firm-name">
            Restaurant: {firmName ? firmName : "Not Updated"}
          </span>
        )}

        {isLoggedIn ? (
          isLoggingOut ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
