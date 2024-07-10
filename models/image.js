const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
  },
  highQualityUrl: {
    type: String,
    required: [true, "high quality url must be provided"],
  },
  lowQualityUrl: {
    type: String,
    required: [true, "low quality url must be provided"],
  },
  size: {
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  categories: {
    type: [String],
    required: [true, "categories must be provided"],
  },
  format: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Image", imageSchema);
