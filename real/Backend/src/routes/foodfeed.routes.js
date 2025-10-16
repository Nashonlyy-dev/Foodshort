// routes/feed.routes.js
const express = require('express');
const router = express.Router();
const { getUserFeed } = require('../controller/foodfeed.controller');
const { authUser } = require('../middlewares/auth.middleware');

// Route to send videos for user feed
router.get('/', authUser, getUserFeed);

module.exports = router;
