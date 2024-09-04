const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true },
    cartItems: [
      {
        name: String,
        price: Number,
        image: String,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
