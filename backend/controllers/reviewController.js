const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Painter = require("../models/Painter");

// @desc   Create a review for a completed booking
// @route  POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the customer who made the booking can review it
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to review this booking" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "You can only review a completed booking" });
    }

    if (booking.reviewed) {
      return res.status(400).json({ message: "This booking has already been reviewed" });
    }

    const review = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      painter: booking.painter,
      rating,
      comment,
    });

    // Mark booking as reviewed
    booking.reviewed = true;
    await booking.save();

    // Recalculate the painter's average rating
    const painterReviews = await Review.find({ painter: booking.painter });
    const avgRating =
      painterReviews.reduce((sum, r) => sum + r.rating, 0) / painterReviews.length;

    await Painter.findByIdAndUpdate(booking.painter, {
      rating: Math.round(avgRating * 10) / 10,
      $inc: { completedJobs: 1 },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all reviews for a painter
// @route  GET /api/reviews/painter/:painterId
const getPainterReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ painter: req.params.painterId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getPainterReviews };