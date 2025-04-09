const mongoose = require("mongoose");

const CustomLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    types: {
      type: [String],
      default: ["store"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    place_id: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    isCustom: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomLocation", CustomLocationSchema);