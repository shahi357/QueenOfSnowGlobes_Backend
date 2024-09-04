const mongoose = require("mongoose");

const GalleryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("GalleryItem", GalleryItemSchema);
