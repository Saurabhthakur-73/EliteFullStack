import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        Elite<span>Finish</span>
      </Link>

      {/* Hamburger button — only visible on mobile via CSS */}
      <button
        className={`nav-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <Link to="/painters" onClick={closeMenu}>
          Find Painters
        </Link>
        <Link to="/products" onClick={closeMenu}>
          Shop
        </Link>
        {userInfo ? (
          <>
            {userInfo.role === "painter" && (
              <>
                <Link to="/create-painter-profile" onClick={closeMenu}>
                  Setup Profile
                </Link>
                <Link to="/dashboard" onClick={closeMenu}>
                  My Bookings
                </Link>
              </>
            )}
            {userInfo.role === "customer" && (
              <Link to="/my-bookings" onClick={closeMenu}>
                My Bookings
              </Link>
            )}
            {userInfo.role === "admin" && (
              <Link to="/admin" onClick={closeMenu}>
                Admin Panel
              </Link>
            )}
            <span className="nav-user">Hi, {userInfo.name}</span>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/signup" className="nav-btn-link" onClick={closeMenu}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;