const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    name: {
      type: String,
      required: true, // "Menu No 1"
    },

    pricePerHead: {
      type: Number,
      required: true,
    },

    items: [
      {
        type: String,
      },
    ],

    category: {
      type: String, // Mehendi, Wedding
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Menu", menuSchema);
