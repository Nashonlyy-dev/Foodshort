// controllers/feed.controller.js
const FoodModel = require('../models/food.model');

async function getUserFeed(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const foods = await FoodModel.find()
      .populate('foodpartner') // attach partner info
      .sort({ createdAt: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      data: foods.map(food => ({
        id: food._id,
        name: food.name,
        description: food.description,
        price: food.price,
        videoUrl: food.video, // assuming your upload model stores video URL in `video`
        partner: food.foodpartner,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch feed' });
  }
}

module.exports = { getUserFeed };
