const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },

    eventType: {
      type: String,
      required: [true, "Event type is required"],
    },

    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: 1,
    },

    // 🔥 MENU REFERENCE
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },

    // 🔥 SNAPSHOT (VERY IMPORTANT)
    menuDetails: {
      name: String,
      pricePerHead: Number,
    },

    // 🔥 PRICING
    pricePerHead: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes to prevent double booking and optimize queries
bookingSchema.index(
  { venue: 1, eventDate: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } } 
  }
);
bookingSchema.index({ customer: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
