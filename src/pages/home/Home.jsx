import React, { useEffect, useState } from "react";
import "./home.css";
import Sidebar from "../sidebar/Sidebar"; // ✅ Import Sidebar

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Remove automatic refresh (Fix Vercel issue)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="home-wrapper">
      {/* ✅ Show loading screen only initially */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading... Please wait.</p>
        </div>
      )}

      {/* ✅ Sidebar & Main Content */}
      <div className="home-container">
        <Sidebar />
        <div className={`home-content ${loading ? "blurred" : ""}`}>
          <h2>Welcome to Vendor Food</h2>
          <p>Thank you for visiting my page.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
