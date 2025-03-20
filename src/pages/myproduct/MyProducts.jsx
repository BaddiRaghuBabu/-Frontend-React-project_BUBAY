import React, { useState, useEffect } from "react";
import { API_URL } from "../../../apiPath/apiPath";
import "./MyProducts.css";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Spinner State

  // Function to fetch product data
  const productsShowData = async () => {
    setLoading(true); // ✅ Show spinner
    const firmId = localStorage.getItem("firmId");

    if (!firmId) {
      console.warn("Firm ID is missing from localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/${firmId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product data");
      }

      const newProductData = await response.json();
      setProducts(newProductData.products || []);
      console.log("Fetched Products:", newProductData);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      alert("Failed to fetch product data");
    } finally {
      setTimeout(() => setLoading(false), 1000); // ✅ Hide spinner after 1s
    }
  };

  // Function to delete a product
  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    setLoading(true); // ✅ Show spinner

    try {
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      alert("Product deleted successfully");
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    } finally {
      setTimeout(() => setLoading(false), 1000); // ✅ Hide spinner after 1s
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    productsShowData();
  }, []);

  return (
    <div className="table-container">
      
      <div className="list-table">
      <h2>Product List</h2>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading... Please wait.</p>
        </div>
      )}
         
      {products.length > 0 ? (
        
        <table className={`styled-table ${loading ? "blurred" : ""}`}>
          
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>₹{product.price.toLocaleString("en-IN")}</td>
                <td>{product.category}</td>
                <td>
                  <img
                    src={`${API_URL}/uploads/${product.img}`}
                    alt={product.productName}
                    className="product-image"
                  />
                </td>
                <td>{product.des}</td>
                <td>
                  <button className="delete-button" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No products available.</p>
      )}
    </div>
  );
};

export default MyProducts;
