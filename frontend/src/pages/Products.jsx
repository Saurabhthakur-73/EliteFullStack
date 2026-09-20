import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const CATEGORIES = ["All", "Paint", "Wallpaper", "Texture", "Material", "Other"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async (category) => {
    setLoading(true);
    setError("");
    try {
      const params = category && category !== "All" ? { category } : {};
      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (err) {
      setError("Could not load products. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h2>Browse Products</h2>
          <p className="products-subtitle">
            Paints, wallpapers, textures &amp; materials for your next project.
          </p>
        </div>
        <Link to="/add-product" className="cta-btn">
          + Add Product
        </Link>
      </div>

      <div className="category-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-pill ${activeCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="empty-state">
          No products found in this category yet. Add some via{" "}
          <code>POST /api/products</code>.
        </p>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p._id}>
            <div className="product-image">
              {p.image ? <img src={p.image} alt={p.name} /> : <span>🎨</span>}
            </div>
            <div className="product-body">
              <span className={`category-tag cat-${p.category?.toLowerCase()}`}>
                {p.category}
              </span>
              <h3>{p.name}</h3>
              {p.brand && <p className="product-brand">{p.brand}</p>}
              <div className="product-footer">
                <span className="product-price">
                  ₹{p.price} <small>/{p.unit}</small>
                </span>
                {!p.inStock && <span className="out-of-stock">Out of stock</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;