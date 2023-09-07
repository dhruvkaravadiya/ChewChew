const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

//get all restaurants
router.get('/', restaurantController.getAllRestaurants);
//get restaurants by id
router.get('/:id',restaurantController.getRestaurantById);
module.exports = router;
