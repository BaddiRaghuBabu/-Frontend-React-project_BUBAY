import React, { useEffect, useState } from "react";
import "./home.css";
import Sidebar from "../sidebar/Sidebar"; // Import Sidebar

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // ✅ Show spinner for smooth transition
    setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    // ✅ Refresh page only once per session
    if (!sessionStorage.getItem("hasRefreshed")) {
      sessionStorage.setItem("hasRefreshed", "true");
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Reload after 2s
    } else {
      setLoading(false); // ✅ Stop loading after first visit
    }
  }, []);

  return (
    <div className="home-wrapper">
      {/* ✅ Initial loading spinner */}
      {initialLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading... Please wait.</p>
        </div>
      )}

      <Sidebar /> {/* ✅ Sidebar always present */}

      <div className={`home-content ${loading ? "blurred" : ""}`}>
        <h2>Welcome to Vendor Food</h2>
        <p>Thank you for visiting my page.</p>
      </div>
    </div>
  );
};

export default Home;
