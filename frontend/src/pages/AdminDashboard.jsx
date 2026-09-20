import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("painters");
  const [stats, setStats] = useState(null);
  const [painters, setPainters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (userInfo.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, paintersRes, productsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/painters"),
        api.get("/admin/products"),
      ]);
      setStats(statsRes.data);
      setPainters(paintersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerify = async (painterId, currentStatus) => {
    try {
      await api.put(`/admin/painters/${painterId}/verify`, { verified: !currentStatus });
      setPainters((prev) =>
        prev.map((p) => (p._id === painterId ? { ...p, verified: !currentStatus } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update verification status");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete product");
    }
  };

  if (loading) return <p className="painters-page">Loading admin panel...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="painters-page">
      <h2>Admin Panel</h2>

      {/* Stats row */}
      {stats && (
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-num">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalPainters}</span>
            <span className="stat-label">Painters</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.verifiedPainters}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalProducts}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalBookings}</span>
            <span className="stat-label">Bookings</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="category-bar">
        <button
          className={`category-pill ${tab === "painters" ? "active" : ""}`}
          onClick={() => setTab("painters")}
        >
          Painters
        </button>
        <button
          className={`category-pill ${tab === "products" ? "active" : ""}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
      </div>

      {/* Painters tab */}
      {tab === "painters" && (
        <div className="dashboard-list">
          {painters.length === 0 && <p className="empty-state">No painters registered yet.</p>}
          {painters.map((p) => (
            <div className="booking-row" key={p._id}>
              <div className="booking-info">
                <h3>{p.user?.name || "Unknown"}</h3>
                <p className="booking-meta">{p.user?.email}</p>
                <p className="booking-meta">
                  {p.city} · {p.skills?.join(", ")}
                </p>
                <p className="booking-meta">
                  Rating: {p.rating || "New"} · {p.completedJobs || 0} jobs
                </p>
              </div>
              <div className="booking-actions">
                <span
                  className="status-tag"
                  style={{ background: p.verified ? "#1e7a3d" : "#a3620a" }}
                >
                  {p.verified ? "Verified" : "Unverified"}
                </span>
                <button
                  className="status-btn"
                  onClick={() => toggleVerify(p._id, p.verified)}
                >
                  {p.verified ? "Unverify" : "Verify"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products tab */}
      {tab === "products" && (
        <div className="dashboard-list">
          {products.length === 0 && <p className="empty-state">No products added yet.</p>}
          {products.map((p) => (
            <div className="booking-row" key={p._id}>
              <div className="booking-info">
                <h3>{p.name}</h3>
                <p className="booking-meta">
                  {p.category} · {p.brand || "No brand"}
                </p>
                <p className="booking-meta">
                  ₹{p.price} / {p.unit}
                </p>
              </div>
              <div className="booking-actions">
                <span
                  className="status-tag"
                  style={{ background: p.inStock ? "#1e7a3d" : "#a31e1e" }}
                >
                  {p.inStock ? "In stock" : "Out of stock"}
                </span>
                <button className="cancel-btn" onClick={() => handleDeleteProduct(p._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;