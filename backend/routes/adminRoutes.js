const express = require("express");
const router = express.Router();
const {
  getAllPainters,
  setPainterVerification,
  getAllProductsAdmin,
  deleteProduct,
  getAllBookings,
  getStats,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.use(protect, isAdmin); // every route below requires an admin

router.get("/stats", getStats);
router.get("/painters", getAllPainters);
router.put("/painters/:id/verify", setPainterVerification);
router.get("/products", getAllProductsAdmin);
router.delete("/products/:id", deleteProduct);
router.get("/bookings", getAllBookings);

module.exports = router;