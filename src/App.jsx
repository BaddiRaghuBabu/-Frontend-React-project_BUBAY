import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Sidebar from "./pages/sidebar/Sidebar";
import AddFirm from "./pages/addfirm/AddFirm";
import AddProduct from "./pages/addproduct/AddProduct";
import MyProducts from "./pages/myproduct/MyProducts";
import Home from "./pages/home/Home";
import Navbar from "./pages/navbar/Navbar";
import NotFound from "./pages/notfound/NotFound";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && (
        <>
          <Navbar handleLogout={handleLogout} />
          <Sidebar />
        </>
      )}

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/add-firm" element={<AddFirm />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
