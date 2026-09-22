import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Forgot Password</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "-0.5rem" }}>
          Enter your email — we'll send you a reset link.
        </p>

        {error && <p className="error-text">{error}</p>}
        {message && (
          <p
            style={{
              color: "#1e7a3d",
              background: "#eaf5ec",
              padding: "0.6rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoCapitalize="none"
          autoCorrect="off"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Remembered your password? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;