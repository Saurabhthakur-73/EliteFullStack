const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    painter: { type: mongoose.Schema.Types.ObjectId, ref: "Painter", required: true },
    serviceType: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    estimatedCost: { type: Number, default: 0 },
    reviewed: { type: Boolean, default: false },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);