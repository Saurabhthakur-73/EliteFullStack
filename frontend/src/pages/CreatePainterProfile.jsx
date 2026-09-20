import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";

const CreatePainterProfile = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    skills: "",
    experienceYears: "",
    city: "",
    pricePerDay: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only logged-in painters should reach this page
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo.role !== "painter") {
      navigate("/painters");
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Convert comma-separated skills string into an array
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.post("/painters", {
        skills: skillsArray,
        experienceYears: Number(form.experienceYears) || 0,
        city: form.city,
        pricePerDay: Number(form.pricePerDay) || 0,
        bio: form.bio,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create painter profile");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-success">
        <h2>✅ Profile Created!</h2>
        <p>Your painter profile is now live. Customers can find and book you.</p>
        <button onClick={() => navigate("/painters")}>View Painters List</button>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Set up your Painter Profile</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "-0.4rem" }}>
          This info will be shown to customers looking to hire you.
        </p>
        {error && <p className="error-text">{error}</p>}

        <input
          name="skills"
          placeholder="Skills (comma separated, e.g. Wall Painting, Wallpaper, Texture)"
          value={form.skills}
          onChange={handleChange}
          required
        />
        <input
          name="experienceYears"
          type="number"
          min="0"
          placeholder="Years of Experience"
          value={form.experienceYears}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City you serve (e.g. Delhi)"
          value={form.city}
          onChange={handleChange}
          required
        />
        <input
          name="pricePerDay"
          type="number"
          min="0"
          placeholder="Price per day (₹)"
          value={form.pricePerDay}
          onChange={handleChange}
        />
        <textarea
          name="bio"
          placeholder="Short bio — tell customers about your work..."
          value={form.bio}
          onChange={handleChange}
          rows={3}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreatePainterProfile;