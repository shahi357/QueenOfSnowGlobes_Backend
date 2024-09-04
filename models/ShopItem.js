const mongoose = require("mongoose");

const ShopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
});

module.exports = mongoose.model("ShopItem", ShopItemSchema);
