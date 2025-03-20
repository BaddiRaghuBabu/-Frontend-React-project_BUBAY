import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const firmName = localStorage.getItem("firmName"); // Get firmName from localStorage

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    setIsLoggedIn(!!token); // Convert to boolean
  }, []);

  // If user is not logged in, don't render sidebar
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="sidebar">
      <h2>🍽️ Food Vendor</h2>
      <ul>
        <li><Link to="/home">🏠 Home</Link></li>

        {/* Disable Add Firm button if firmName exists */}
        <li>
          <Link
            to="/add-firm"
            className={firmName ? "disabled-link" : ""}
            onClick={(e) => firmName && e.preventDefault()}
            title={firmName ? "Firm already registered" : ""}
          >
            ➕ Add Firm
          </Link>
        </li>

        <li><Link to="/add-product">🍔 Add Product</Link></li>
        <li><Link to="/my-products">📦 My Products</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
