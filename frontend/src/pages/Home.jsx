import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import painterHero from "../assets/Homeimg.png";

const Home = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      params.set("location", location);
    }

    if (serviceType) {
      params.set("service", serviceType);
    }

    navigate(`/painters?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="trust-badge">
            ✦ Trusted by 10,000+ happy homes
          </span>

          <h1>
            Beautiful Spaces <br />
            Start with the <span>Right Painter</span>
          </h1>

          <p className="home-hero-sub">
            Find verified painters, compare quotes, buy paints & materials,
            and get your home transformed — all in one place.
          </p>

          <form className="home-search-bar" onSubmit={handleSearch}>
            <div className="search-field">
              <span className="search-icon">📍</span>

              <div>
                <label>Your Location</label>

                <input
                  type="text"
                  placeholder="e.g. Delhi NCR"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="search-divider" />

            <div className="search-field">
              <span className="search-icon">🖌️</span>

              <div>
                <label>Service Type</label>

                <input
                  type="text"
                  placeholder="Interior Painting"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="search-btn">
              🔍 Find Painters
            </button>
          </form>

          <div className="trust-checks">
            <span>✅ Verified Professionals</span>
            <span>✅ Transparent Pricing</span>
            <span>✅ Quick Quotes</span>
            <span>✅ Quality Assurance</span>
          </div>
        </div>

        {/* ---------- Painter Image ---------- */}
        <div className="home-hero-visual">
          <img
            src={painterHero}
            alt="Painter painting a wall"
            className="hero-painter-image"
          />
        </div>
      </section>

      {/* ---------- Stats bar ---------- */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🏠</span>
          <strong>10,000+</strong>
          <span>Homes Painted</span>
        </div>

        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <strong>2,500+</strong>
          <span>Verified Painters</span>
        </div>

        <div className="stat-item">
          <span className="stat-icon">🗂️</span>
          <strong>500+</strong>
          <span>Products in Catalog</span>
        </div>

        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <strong>4.8/5</strong>
          <span>Customer Rating</span>
        </div>

        <div className="stat-quote">
          “EliteFinish made it so easy to find a skilled painter. Great
          experience!”

          <div className="stat-quote-author">
            — Priya Sharma, Delhi
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="how-it-works">
        <h2>
          How Elite<span>Finish</span> Works
        </h2>

        <p className="how-subtitle">
          Get your dream home in just a few simple steps
        </p>

        <div className="steps-row">
          <div className="step-card">
            <div className="step-icon">🔍</div>

            <h3>1. Search</h3>

            <p>
              Enter your location and service requirements
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-icon">👥</div>

            <h3>2. Compare</h3>

            <p>
              View verified painters, ratings and quotes
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-icon">🖌️</div>

            <h3>3. Book</h3>

            <p>
              Choose the best pro and schedule your work
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-icon">🏡</div>

            <h3>4. Transform</h3>

            <p>
              Sit back and watch your space get a makeover
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;