const Painter = require("../models/Painter");

// @desc   Get all painters (with optional city / skill filter)
// @route  GET /api/painters?city=Delhi&skill=Wallpaper
const getPainters = async (req, res) => {
  try {
    const { city, skill } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (skill) filter.skills = new RegExp(skill, "i");

    const painters = await Painter.find(filter).populate("user", "name email phone");
    res.json(painters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create painter profile (after registering as a painter user)
// @route  POST /api/painters
const createPainterProfile = async (req, res) => {
  try {
    const { skills, experienceYears, city, pricePerDay, bio } = req.body;

    const painter = await Painter.create({
      user: req.user._id,
      skills,
      experienceYears,
      city,
      pricePerDay,
      bio,
    });

    res.status(201).json(painter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get single painter by ID
// @route  GET /api/painters/:id
const getPainterById = async (req, res) => {
  try {
    const painter = await Painter.findById(req.params.id).populate("user", "name email phone");
    if (!painter) return res.status(404).json({ message: "Painter not found" });
    res.json(painter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPainters, createPainterProfile, getPainterById };
