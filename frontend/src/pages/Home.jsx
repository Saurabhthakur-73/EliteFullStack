import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>
          Find the right painter <span>within 10 minutes</span>
        </h1>
        <p>
          Discover verified painters, decorators & home-furnishing professionals near you.
          Compare, hire, and get your space transformed — fast.
        </p>
        <Link to="/painters" className="cta-btn">
          Find Painters Near Me →
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🎨 Verified Professionals</h3>
          <p>Every painter on EliteFinish is background-verified and rated by real customers.</p>
        </div>
        <div className="feature-card">
          <h3>🛒 Product Catalog</h3>
          <p>Browse paints, wallpapers, textures and materials from trusted brands.</p>
        </div>
        <div className="feature-card">
          <h3>📸 AI Estimation (Coming Soon)</h3>
          <p>Scan your space and get an instant Bill of Quantities in seconds.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
