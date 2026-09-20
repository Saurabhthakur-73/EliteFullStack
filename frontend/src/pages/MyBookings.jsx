import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const statusColor = {
  pending: "#a3620a",
  accepted: "#1e6fa3",
  "in-progress": "#7a3dc2",
  completed: "#1e7a3d",
  cancelled: "#a31e1e",
};

const StarInput = ({ value, onChange }) => {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""}`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({ bookingId, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/reviews", { bookingId, rating, comment });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      {error && <p className="error-text">{error}</p>}
      <StarInput value={rating} onChange={setRating} />
      <textarea
        placeholder="How was your experience? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

const MyBookings = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchBookings();
    loadRazorpayScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const loadRazorpayScript = () => {
    if (document.getElementById("razorpay-checkout-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, reviewed: true } : b))
    );
    setReviewingId(null);
  };

  const handlePayNow = async (booking) => {
    setPayingId(booking._id);
    try {
      const { data } = await api.post("/payments/create-order", {
        bookingId: booking._id,
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "EliteFinish",
        description: `Payment for ${booking.serviceType}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            setBookings((prev) =>
              prev.map((b) =>
                b._id === booking._id ? { ...b, paymentStatus: "paid" } : b
              )
            );
            alert("Payment successful!");
          } catch (err) {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: userInfo.name,
        },
        theme: { color: "#c0114b" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Could not start payment");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="painters-page">
      <h2>My Bookings</h2>

      {loading && <p>Loading your bookings...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="empty-state">
          You haven't booked any painter yet. Head to "Find Painters" to get started.
        </p>
      )}

      <div className="dashboard-list">
        {bookings.map((b) => (
          <div className="booking-row" key={b._id}>
            <div className="booking-info">
              <h3>{b.serviceType}</h3>
              <p className="booking-meta">
                Painter: {b.painter?.user?.name || "N/A"}
                {b.painter?.user?.phone ? ` · ${b.painter.user.phone}` : ""}
              </p>
              <p className="booking-meta">
                {b.address}, {b.city}
              </p>
              <p className="booking-meta">
                Preferred date: {new Date(b.preferredDate).toLocaleDateString()}
              </p>
              {b.painter?.pricePerDay ? (
                <p className="booking-meta">₹{b.painter.pricePerDay} / day</p>
              ) : null}
              {b.notes && <p className="booking-notes">"{b.notes}"</p>}

              {/* Payment section */}
              {b.status !== "cancelled" && (
                <p className="booking-meta">
                  Payment:{" "}
                  <strong style={{ color: b.paymentStatus === "paid" ? "#1e7a3d" : "#a3620a" }}>
                    {b.paymentStatus === "paid" ? "Paid ✅" : "Unpaid"}
                  </strong>
                </p>
              )}

              {b.paymentStatus !== "paid" && b.status !== "cancelled" && b.status !== "pending" && (
                <button
                  className="review-link-btn"
                  onClick={() => handlePayNow(b)}
                  disabled={payingId === b._id}
                >
                  {payingId === b._id ? "Opening..." : "💳 Pay Now"}
                </button>
              )}

              {/* Review section for completed bookings */}
              {b.status === "completed" && !b.reviewed && (
                <>
                  {reviewingId === b._id ? (
                    <ReviewForm
                      bookingId={b._id}
                      onSubmitted={() => handleReviewSubmitted(b._id)}
                    />
                  ) : (
                    <button
                      className="review-link-btn"
                      onClick={() => setReviewingId(b._id)}
                    >
                      ⭐ Leave a Review
                    </button>
                  )}
                </>
              )}

              {b.status === "completed" && b.reviewed && (
                <p className="review-done">✅ You reviewed this job</p>
              )}
            </div>

            <div className="booking-actions">
              <span
                className="status-tag"
                style={{ background: statusColor[b.status] || "#888" }}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;