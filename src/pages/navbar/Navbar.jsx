import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loginToken"));
  const [firmName, setFirmName] = useState(localStorage.getItem("firmName") || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Show spinner

  // ✅ Smooth Initial Refresh (Only Once)
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("loginRefreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("loginRefreshed", "true");
      setTimeout(() => {
        window.location.reload();
      }, 2000); // ✅ Wait 2 sec before reloading (smooth transition)
    }
  }, []);

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
        setIsLoggingOut(true); // Show spinner

        setTimeout(() => {
          localStorage.clear(); // ✅ Clears all login-related data
          setIsLoggedIn(false);
          setFirmName("");
          setIsLoggingOut(false); // Hide spinner
          navigate("/login");

          setTimeout(() => {
            window.location.reload(); // ✅ Smooth refresh after logout
          }, 500); // 0.5 sec delay for smooth transition
        }, 1000); // 1-second delay for smoother logout experience
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">🍽️ Vendor Portal</Link>

            {isLoggedIn && (
      <span className="firm-name">
        Restaurant:{" "}
        {firmName ? (
          firmName
        ) : (
          <>
            Not Updated Firm{" "}
            <Link to="/home" onClick={() => setTimeout(() => window.location.reload(), 500)}>
              Refresh
            </Link>
          </>
        )}
      </span>
        )}

        {isLoggedIn ? (
          isLoggingOut ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div> // Show loading animation
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
