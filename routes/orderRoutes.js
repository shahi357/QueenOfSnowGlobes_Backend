const express = require("express");
const Order = require("../models/Order");
const CustomOrder = require("../models/CustomOrder");
const router = express.Router();

// Add order
router.post("/add", async (req, res) => {
  const { cartItems, total, email } = req.body;

  if (!cartItems || !total || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newOrder = new Order({
      cartItems,
      total,
      email,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
    console.error("Order created successfully at backend.");
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add custom order
router.post("/custom/add", async (req, res) => {
  const { projectName, template, email } = req.body;

  if (!projectName || !template || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newCustomOrder = new CustomOrder({
      projectName,
      template,
      email,
    });

    await newCustomOrder.save();

    res.status(201).json({
      message: "Custom order placed successfully",
      customOrder: newCustomOrder,
    });
  } catch (error) {
    console.error("Error placing custom order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// Get all custom orders
router.get("/customOrders", async (req, res) => {
  try {
    const customOrders = await CustomOrder.find().sort({ createdAt: -1 });
    res.json(customOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch custom orders." });
  }
});

// Get orders by user email
router.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders." });
  }
});

// Get custom orders by user email
router.get("/customOrders/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const customOrders = await CustomOrder.find({ email }).sort({
      createdAt: -1,
    });
    res.json(customOrders);
  } catch (error) {
    console.error("Error fetching user custom orders:", error);
    res.status(500).json({ message: "Failed to fetch user custom orders." });
  }
});

// Delete order by order number
router.delete("/delete/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const deletedOrder = await Order.findOneAndDelete({ orderNumber });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete custom order by order number
router.delete("/custom/delete/:orderNumber", async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const deletedOrder = await CustomOrder.findOneAndDelete({ orderNumber });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
