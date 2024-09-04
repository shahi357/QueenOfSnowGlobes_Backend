const express = require("express");
const router = express.Router();
const ShopItem = require("../models/ShopItem");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// Add a shop item
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, price } = req.body;
  const image = req.file.filename;

  try {
    const newShopItem = new ShopItem({ name, image, price });
    await newShopItem.save();
    res.status(201).json(newShopItem);
    console.log("Shop item created successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all shop items
router.get("/items", async (req, res) => {
  try {
    const shopItems = await ShopItem.find();
    const items = shopItems.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      src: `/uploads/${item.image}`,
    }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shop items." });
  }
});

// Delete a shop item
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const shopItem = await ShopItem.findById(id);

    if (!shopItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete the image file from the server
    const filePath = path.join(__dirname, "../uploads", shopItem.image);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
        return res.status(500).json({ message: "Failed to delete image file" });
      }
    });

    // Delete the shop item from the database
    await ShopItem.findByIdAndDelete(id);
    res.json({ message: "Shop item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete shop item" });
  }
});

module.exports = router;
