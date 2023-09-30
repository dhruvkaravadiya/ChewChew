const Restaurant = require('../models/Restaurant');
const Food = require("../models/Food");
const mongoose = require('mongoose');

async function createRestaurant(req, res) {
    if (!req.body) {
        return res.status(400).send("Please Enter Necessary Details");
    }
    const newRes = new Restaurant({ ...req.body, user_id: req.user._id });
    const savedRestaurant = await newRes.save();
    res.status(201).json(savedRestaurant);
}

async function deleteRestaurant(req, res) {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
        return res.status(404).send("Restaurant not found");
    }
    res.status(200).send("Restaurant Deleted Successfully");
}

async function getAllRestaurants(req, res) {
    const restaurants = await Restaurant.find({});
    if (!restaurants || restaurants.length === 0) {
        return res.status(404).send("No Restaurants found");
    }
    res.status(200).json(restaurants);
}

async function getRestaurantById(req, res) {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        return res.status(404).send("Restaurant not found");
    }
    res.status(200).json(restaurant);
}

async function updateRestaurantDetails(req, res) {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updatedRestaurant) {
        return res.status(404).send("Restaurant not found");
    }
    res.status(200).send("Restaurant Update Successfully");
}

async function addMenuItem(req, res) {
    const currRes = await Restaurant.findOne({ user_id: req.user._id });
    if (!currRes) {
        return res.status(404).send("Restaurant Not found");
    }
    const { name, price, foodImgUrl, type } = req.body;
    if (!name || !price || !foodImgUrl || !type) {
        return res.status.send("Please enter necesarry details");
    }
    const newItem = new Food({
        name, price, foodImgUrl, type,
        restaurant: {
            resId: req.user._id,
            resName: currRes.restaurantName
        }
    });
    const response = await newItem.save();
    await Restaurant.findByIdAndUpdate(currRes._id, { $push: { menu: response._id } });
    res.status(200).json({ success: true, newItem: response });
}

async function updateMenuItem(req, res) {
    const currUserId = req.user._id;
    if (!currUserId) {
        return res.status(404).send("User not found");
    }

    const currRes = await Restaurant.findOne({ user_id: currUserId });
    if (!currRes) {
        return res.status(404).send("Restaurant not Found");
    }

    const { name, price, foodImgUrl, type } = req.body;
    if (!name & !price & !foodImgUrl & !type) {
        return res.status(400).send("Please provide necessary details");
    }

    const updatedMenuItem = await Food.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name,
                price,
                foodImgUrl,
                type
            },
        },
    );
    if (!updatedMenuItem) {
        return res.status(404).send("Menu item not found");
    }

    res.status(200).json({ success: true, updatedMenuItem });
}

async function deleteMenuItem(req, res) {

    const deletedRestaurant = await Food.findByIdAndDelete(req.params.id);
    if(!deletedRestaurant){
        return res.status(404).send("Restaurant Not Found");
    }
    res.status(200).send("Menu Deleted Successfully");
}
module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurantDetails,
    deleteRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};