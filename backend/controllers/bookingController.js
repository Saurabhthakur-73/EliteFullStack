const Booking = require("../models/Booking");
const Painter = require("../models/Painter");

// @desc   Create a new booking
// @route  POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { painter, serviceType, address, city, preferredDate, notes, estimatedCost } = req.body;

    const booking = await Booking.create({
      customer: req.user._id,
      painter,
      serviceType,
      address,
      city,
      preferredDate,
      notes,
      estimatedCost,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get bookings for the logged-in customer
// @route  GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate({
        path: "painter",
        select: "city rating pricePerDay",
        populate: { path: "user", select: "name phone" },
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get bookings assigned to the logged-in painter
// @route  GET /api/bookings/painter
const getPainterBookings = async (req, res) => {
  try {
    const painterProfile = await Painter.findOne({ user: req.user._id });

    if (!painterProfile) {
      return res.status(404).json({ message: "Painter profile not found for this user" });
    }

    const bookings = await Booking.find({ painter: painterProfile._id })
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update booking status
// @route  PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status || booking.status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getPainterBookings, updateBookingStatus };