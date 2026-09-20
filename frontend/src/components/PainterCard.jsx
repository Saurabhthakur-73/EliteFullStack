import React from "react";
import { Link } from "react-router-dom";

const PainterCard = ({ painter }) => {
  return (
    <div className="painter-card">
      <div className="painter-avatar">
        {painter.user?.name ? painter.user.name.charAt(0).toUpperCase() : "P"}
      </div>
      <h3>{painter.user?.name || "Painter"}</h3>
      <p className="painter-city">{painter.city}</p>
      <div className="painter-skills">
        {(painter.skills || []).map((skill, i) => (
          <span key={i} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>
      <p className="painter-rating">⭐ {painter.rating || "New"} · {painter.completedJobs || 0} jobs</p>
      <p className="painter-price">₹{painter.pricePerDay || "—"} / day</p>
      <Link to={`/book/${painter._id}`} className="book-btn">
        Book Now
      </Link>
    </div>
  );
};

export default PainterCard;
