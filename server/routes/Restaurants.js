const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');

//get all restaurants
router.get('/', asyncErrorHandler(restaurantController.getAllRestaurants));
//get restaurants by id
router.get('/:id',asyncErrorHandler(restaurantController.getRestaurantById));
//update restaurant by id
router.put("/edit/:id" , asyncErrorHandler(restaurantController.updateRestaurantDetails));
module.exports = router;
