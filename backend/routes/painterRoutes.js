const express = require("express");
const router = express.Router();
const {
  getPainters,
  createPainterProfile,
  getPainterById,
} = require("../controllers/painterController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getPainters);
router.post("/", protect, createPainterProfile);
router.get("/:id", getPainterById);

module.exports = router;
