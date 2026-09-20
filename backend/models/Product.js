const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Paint", "Wallpaper", "Texture", "Material", "Other"],
      required: true,
    },
    brand: { type: String, trim: true },
    price: { type: Number, required: true },
    unit: { type: String, default: "per litre" }, // per litre, per sqft, per roll
    description: { type: String, trim: true },
    image: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
