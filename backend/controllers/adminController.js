const Painter = require("../models/Painter");
const Product = require("../models/Product");
const Booking = require("../models/Booking");
const User = require("../models/User");

// @desc   Get all painters (verified + unverified) with user info
// @route  GET /api/admin/painters
const getAllPainters = async (req, res) => {
  try {
    const painters = await Painter.find()
      .populate("user", "name email phone city")
      .sort({ createdAt: -1 });
    res.json(painters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Verify or unverify a painter
// @route  PUT /api/admin/painters/:id/verify
const setPainterVerification = async (req, res) => {
  try {
    const painter = await Painter.findById(req.params.id);
    if (!painter) return res.status(404).json({ message: "Painter not found" });

    painter.verified = req.body.verified;
    await painter.save();

    res.json(painter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all products
// @route  GET /api/admin/products
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a product
// @route  DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all bookings platform-wide
// @route  GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email")
      .populate({ path: "painter", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get platform stats summary
// @route  GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalPainters, verifiedPainters, totalProducts, totalBookings] =
      await Promise.all([
        User.countDocuments(),
        Painter.countDocuments(),
        Painter.countDocuments({ verified: true }),
        Product.countDocuments(),
        Booking.countDocuments(),
      ]);

    res.json({ totalUsers, totalPainters, verifiedPainters, totalProducts, totalBookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPainters,
  setPainterVerification,
  getAllProductsAdmin,
  deleteProduct,
  getAllBookings,
  getStats,
};