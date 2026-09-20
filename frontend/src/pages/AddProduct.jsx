import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const CATEGORIES = ["Paint", "Wallpaper", "Texture", "Material", "Other"];

const AddProduct = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "Paint",
    brand: "",
    price: "",
    unit: "per litre",
    description: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only logged-in users should reach this page
  React.useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price) || 0,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add product");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success">
        <h2>✅ Product Added!</h2>
        <p>Your product is now live in the catalog.</p>
        <button onClick={() => navigate("/products")}>View Products</button>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add a Product</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          name="name"
          placeholder="Product Name (e.g. Asian Paints Royale)"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          name="brand"
          placeholder="Brand (e.g. Asian Paints)"
          value={form.brand}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          min="0"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="unit"
          placeholder="Unit (e.g. per litre, per roll, per sqft)"
          value={form.unit}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL (optional)"
          value={form.image}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Short description..."
          value={form.description}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;