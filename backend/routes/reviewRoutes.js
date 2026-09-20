const express = require("express");
const router = express.Router();
const { createReview, getPainterReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/painter/:painterId", getPainterReviews);

module.exports = router;