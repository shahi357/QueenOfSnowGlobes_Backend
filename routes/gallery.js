const express = require("express");
const router = express.Router();
const GalleryItem = require("../models/GalleryItem");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// Add a gallery item
router.post("/add", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const image = req.file.filename;

  try {
    const newGalleryItem = new GalleryItem({ name, image });
    await newGalleryItem.save();
    res.status(201).json(newGalleryItem);
    console.log("Gallery item created successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all gallery items
router.get("/images", async (req, res) => {
  try {
    const galleryItems = await GalleryItem.find();
    const images = galleryItems.map((item) => ({
      id: item._id,
      name: item.name,
      src: `/uploads/${item.image}`,
    }));
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery images" });
  }
});

// Delete a gallery item
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const galleryItem = await GalleryItem.findById(id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete the image file from the server
    const filePath = path.join(__dirname, "../uploads", galleryItem.image);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
        return res.status(500).json({ message: "Failed to delete image file" });
      }
    });

    // Delete the gallery item from the database
    await GalleryItem.findByIdAndDelete(id);
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
});

module.exports = router;
