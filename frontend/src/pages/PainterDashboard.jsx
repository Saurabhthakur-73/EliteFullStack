import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const STATUS_FLOW = ["pending", "accepted", "in-progress", "completed"];

const statusColor = {
  pending: "#a3620a",
  accepted: "#1e6fa3",
  "in-progress": "#7a3dc2",
  completed: "#1e7a3d",
  cancelled: "#a31e1e",
};

const PainterDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (userInfo.role !== "painter") {
      navigate("/painters");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings/painter");
      setBookings(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load bookings. Have you created your painter profile yet?"
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="painters-page">
      <h2>My Bookings Dashboard</h2>

      {loading && <p>Loading your bookings...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="empty-state">
          No bookings yet. Once customers book you, requests will show up here.
        </p>
      )}

      <div className="dashboard-list">
        {bookings.map((b) => {
          const next = nextStatus(b.status);
          return (
            <div className="booking-row" key={b._id}>
              <div className="booking-info">
                <h3>{b.serviceType}</h3>
                <p className="booking-meta">
                  {b.customer?.name} · {b.customer?.phone || "No phone"}
                </p>
                <p className="booking-meta">
                  {b.address}, {b.city}
                </p>
                <p className="booking-meta">
                  Preferred date: {new Date(b.preferredDate).toLocaleDateString()}
                </p>
                {b.notes && <p className="booking-notes">"{b.notes}"</p>}
              </div>

              <div className="booking-actions">
                <span
                  className="status-tag"
                  style={{ background: statusColor[b.status] || "#888" }}
                >
                  {b.status}
                </span>

                {next && b.status !== "cancelled" && (
                  <button
                    className="status-btn"
                    disabled={updatingId === b._id}
                    onClick={() => handleUpdateStatus(b._id, next)}
                  >
                    {updatingId === b._id ? "Updating..." : `Mark as ${next}`}
                  </button>
                )}

                {b.status === "pending" && (
                  <button
                    className="cancel-btn"
                    disabled={updatingId === b._id}
                    onClick={() => handleUpdateStatus(b._id, "cancelled")}
                  >
                    Decline
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainterDashboard;