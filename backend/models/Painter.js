const mongoose = require("mongoose");

const painterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skills: [{ type: String, trim: true }], // e.g. ["Wall Painting", "Wallpaper", "Texture"]
    experienceYears: { type: Number, default: 0 },
    city: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    completedJobs: { type: Number, default: 0 },
    pricePerDay: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    portfolioImages: [{ type: String }], // URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Painter", painterSchema);
