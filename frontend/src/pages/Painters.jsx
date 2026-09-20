import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PainterCard from "../components/PainterCard.jsx";

const Painters = () => {
  const [painters, setPainters] = useState([]);
  const [city, setCity] = useState("");
  const [skill, setSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPainters = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/painters", { params: { city, skill } });
      setPainters(data);
    } catch (err) {
      setError("Could not load painters. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPainters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPainters();
  };

  return (
    <div className="painters-page">
      <h2>Find Verified Painters</h2>

      <form className="filter-bar" onSubmit={handleFilter}>
        <input placeholder="City (e.g. Delhi)" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Skill (e.g. Wallpaper)" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading painters...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && painters.length === 0 && (
        <p className="empty-state">
          No painters found yet. Once you connect MongoDB and add data, they'll show up here.
        </p>
      )}

      <div className="painters-grid">
        {painters.map((p) => (
          <PainterCard key={p._id} painter={p} />
        ))}
      </div>
    </div>
  );
};

export default Painters;
