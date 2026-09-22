import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Painters from "./pages/Painters.jsx";
import Products from "./pages/Products.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import CreatePainterProfile from "./pages/CreatePainterProfile.jsx";
import PainterDashboard from "./pages/PainterDashboard.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ForgotPassword from './pages/ForgotPassword.jsx'; 
import ResetPassword from './pages/ResetPassword.jsx';
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/painters" element={<Painters />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/book/:painterId" element={<BookingForm />} />
          <Route path="/create-painter-profile" element={<CreatePainterProfile />} />
          <Route path="/dashboard" element={<PainterDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </main>
    </>
  );
}

export default App;