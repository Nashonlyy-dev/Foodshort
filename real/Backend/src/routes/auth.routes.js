const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

// user routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser); 
router.get('/user/logout', authController.logoutUser);

// food partner routes
router.post('/partner/register', authController.registerPartner);
router.post('/partner/login', authController.loginPartner);
router.get('/partner/logout', authController.logoutPartner)


module.exports = router;``