const FoodModel = require("../models/food.model");
const StorageService = require("../services/storage.services");
const { v4: uuid } = require("uuid");
const fs = require("fs");

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.foodPartner) {
      return res.status(401).json({ message: "Unauthorized: Partner not found" });
    }

    const filePath = req.file.path;
    if (!filePath) {
      return res.status(400).json({ message: "Uploaded file has no path" });
    }

    // upload to ImageKit
    const uploadRes = await StorageService.uploadFile(filePath, uuid());

    const foodItem = await FoodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      video: uploadRes.url,
      foodpartner: req.foodPartner._id, // ✅ lowercase
    });

    // cleanup
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete temp upload file", err);
    });

    res.status(201).json({
      message: "Food item created successfully",
      foodItem,
      file: {
        url: uploadRes.url,
        fileId: uploadRes.fileId,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

async function getFoodItem(req, res) {
  const foodItem = await FoodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItem,
  });
}

module.exports = {
  createFood,
  getFoodItem,
};
