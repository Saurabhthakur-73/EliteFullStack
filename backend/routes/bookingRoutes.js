const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getPainterBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/painter", protect, getPainterBookings);
router.put("/:id/status", protect, updateBookingStatus);

module.exports = router;