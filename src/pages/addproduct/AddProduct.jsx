import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import "./AddProduct.css";
import { API_URL } from "../../../apiPath/apiPath";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [image, setFile] = useState(null);
  const [des, setDes] = useState("");
  const [loading, setLoading] = useState(false); // Form submission loader
  const [initialLoading, setInitialLoading] = useState(true); // Page load spinner
  const [redirectLoading, setRedirectLoading] = useState(false); // Redirect spinner
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  const navigate = useNavigate(); // Hook for redirection

  // Simulate page load delay
  useEffect(() => {
    setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // 1-second delay

    // Check if user is authenticated
    const loginToken = localStorage.getItem("loginToken");
    const firmId = localStorage.getItem("firmId");

    if (loginToken && firmId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleBestSellerChange = (event) => {
    const value = event.target.value;
    setBestSeller((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setFile(selectedImage);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner on submit

    try {
      const loginToken = localStorage.getItem("loginToken");
      const firmId = localStorage.getItem("firmId");

      if (!loginToken || !firmId) {
        console.error("User not authenticated. Missing:", {
          loginToken: loginToken || "No token",
          firmId: firmId || "No firmId",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("des", des);
      formData.append("image", image);

      category.forEach((value) => {
        formData.append("category", value);
      });

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Product added successfully!");

        // Reset form fields
        setProductName("");
        setPrice("");
        setCategory([]);
        setBestSeller([]);
        setFile(null);
        setDes("");

        // ✅ Show redirect spinner and navigate after 2 seconds
        setRedirectLoading(true);
        setTimeout(() => {
          setRedirectLoading(false);
          navigate("/home");
        }, 2000);
      } else {
        alert("Failed to add the product");
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to add product");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <>
      {/* Initial Page Loading Spinner */}
      {initialLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading... Please wait.</p>
        </div>
      ) : redirectLoading ? (
        // ✅ Redirect Loading Spinner before navigating
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Redirecting to Home...</p>
        </div>
      ) : (
        <>
          {/* If user is not authenticated, redirect to login */}
          {!isAuthenticated ? (
            <div className="unauthorized-container">
              <h2>Unauthorized Access</h2>
              <p>You must be logged in to add a product.</p>
              <button onClick={() => navigate("/home")}>Go to Firm</button>
            </div>
          ) : (
            <div className="body-addproduct">
              <div className="add-product-container">
                <h2>Add Product</h2>
                <form className="form-container" onSubmit={handleProductSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <label className="category-label">Category:</label>
                  <div className="checkbox-group">
                    <label>
                      <input type="checkbox" value="veg" onChange={handleCategoryChange} />
                      Veg
                    </label>
                    <label>
                      <input type="checkbox" value="non-veg" onChange={handleCategoryChange} />
                      Non-Veg
                    </label>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <label>
                    <input type="checkbox" value="bestSeller" onChange={handleBestSellerChange} />
                    Best Seller
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                  ></textarea>

                  {/* Submit Button with Spinner */}
                  <button type="submit" disabled={loading}>
                    {loading ? <div className="button-spinner"></div> : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AddProduct;
