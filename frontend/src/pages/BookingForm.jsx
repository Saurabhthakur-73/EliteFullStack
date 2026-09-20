import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const BookingForm = () => {
  const { painterId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceType: "",
    address: "",
    city: "",
    preferredDate: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userInfo) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await api.post("/bookings", { ...form, painter: painterId });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create booking");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success">
        <h2>✅ Booking request sent!</h2>
        <p>The painter will confirm your request shortly.</p>
        <button onClick={() => navigate("/painters")}>Back to Painters</button>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Book this Painter</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          name="serviceType"
          placeholder="Service Type (e.g. Wall Painting)"
          value={form.serviceType}
          onChange={handleChange}
          required
        />
        <input name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input
          name="preferredDate"
          type="date"
          value={form.preferredDate}
          onChange={handleChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Any additional notes..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending request..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
