const express = require("express");
const foodController = require("../controller/food.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use disk storage to avoid buffering large files in memory.
const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const router = express.Router();

router.post(
  "/",
  authMiddleware.authFoodPartner,
  upload.single("video"),
  foodController.createFood
);

router.get("/", authMiddleware.authUser, foodController.getFoodItem);

module.exports = router;
