import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Elite<span>Finish</span>
      </Link>
      <div className="nav-links">
        <Link to="/painters">Find Painters</Link>
        <Link to="/products">Shop</Link>
        {userInfo ? (
          <>
            {userInfo.role === "painter" && (
              <>
                <Link to="/create-painter-profile">Setup Profile</Link>
                <Link to="/dashboard">My Bookings</Link>
              </>
            )}
            {userInfo.role === "customer" && (
              <Link to="/my-bookings">My Bookings</Link>
            )}
            {userInfo.role === "admin" && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <span className="nav-user">Hi, {userInfo.name}</span>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="nav-btn-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;