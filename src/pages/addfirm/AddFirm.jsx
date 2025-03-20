import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AddFirm.css";
import { API_URL } from "../../../apiPath/apiPath";

const AddFirm = () => {
  const [firmName, setFirmName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ✅ Initial Loading Spinner
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Optimized Checkbox Handling
  const handleCheckboxChange = useCallback((value, setState) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  }, []);

  const handleImageUpload = (event) => {
    setFile(event.target.files[0]);
  };

  // ✅ Handle Form Submission
  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loginToken = localStorage.getItem("loginToken");
      if (!loginToken) {
        alert("User not authenticated");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("firmName", firmName);
      formData.append("address", address);
      formData.append("offer", offer);

      if (file) {
        formData.append("image", file); // ✅ Prevents empty file upload
      }

      category.forEach((value) => formData.append("category", value));
      region.forEach((value) => formData.append("region", value));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: { token: loginToken },
        body: formData,
      });

      const data = await response.json();
      console.log("Firm Creation Response:", data);

      if (response.ok) {
        alert("Firm added successfully!");
        localStorage.setItem("firmId", data.firmId);
        localStorage.setItem("firmName", data.vendorFirmName);

        // ✅ Redirect **without reload**
        navigate("/home");
      } else if (data.message === "vendor can have only one firm") {
        alert("Firm Exists 🥗. Only 1 firm can be added.");
      } else {
        alert("Failed to add Firm ❌");
      }
    } catch (error) {
      console.error("Error adding firm:", error);
      alert("Internal server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="body-Addfirm">
      {isLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={`add-firm-container animate ${isSubmitting ? "blurred" : ""}`}>
          <h2>Add Firm</h2>
          <form className="form-container" onSubmit={handleFirmSubmit}>
            <input
              type="text"
              name="firmName"
              placeholder="Firm Name"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            {/* Category Selection */}
            <label>Category:</label>
            <label>
              <input
                type="checkbox"
                value="veg"
                onChange={() => handleCheckboxChange("veg", setCategory)}
                checked={category.includes("veg")}
              />{" "}
              Veg
            </label>
            <label>
              <input
                type="checkbox"
                value="non-veg"
                onChange={() => handleCheckboxChange("non-veg", setCategory)}
                checked={category.includes("non-veg")}
              />{" "}
              Non-Veg
            </label>

            {/* Region Selection */}
            <label>Region:</label>
            <label>
              <input
                type="checkbox"
                value="north-india"
                onChange={() => handleCheckboxChange("north-india", setRegion)}
                checked={region.includes("north-india")}
              />{" "}
              North India
            </label>
            <label>
              <input
                type="checkbox"
                value="south-india"
                onChange={() => handleCheckboxChange("south-india", setRegion)}
                checked={region.includes("south-india")}
              />{" "}
              South India
            </label>

            <input
              type="text"
              name="offer"
              placeholder="Offers (Optional)"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div> Submitting...
                </>
              ) : (
                "Add Firm"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddFirm;
