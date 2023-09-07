const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
// Restaurant Sign Up
router.post('/ressignup',AuthController.restaurantSignUp);
//Restaurant Login
router.post('/reslogin',AuthController.restaurantLogin);

//Customer Sign Up

//Customer Login

//Delivery-Man Sign Up

//Delivery-Man Login

module.exports = router;