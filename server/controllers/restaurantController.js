const Restaurant = require('../models/Restaurant');
const Food = require("../models/Food");
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const { CLOUDINARY_NAME, CLOUDINARY_API, CLOUDINARY_API_SECRET } = require('../config/appConfig');;

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API,
    api_secret: CLOUDINARY_API_SECRET,
});

async function createRestaurant(req, res) {
    const { address, restaurantName, phoneNumber } = req.body;
    if (!address || !restaurantName || !phoneNumber) {
        return res.status(200).send({
            success: false,
            error: "Please Enter Necessary Details"
        });
    }

    if (req.files && req.files.photo) {
        const file = req.files.photo;

        // Step 2: Upload the photo to Cloudinary
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "FOA_Restaurants",
            width: 150,
            public_id: file.name
        });
        const photoId = result.public_id;
        const photoUrl = result.secure_url;
        const newRes = new Restaurant({
            restaurantName,
            phoneNumber,
            address,
            photo: {
                id : photoId,
                photoUrl : photoUrl
            },
            user_id: req.user._id
        });
        const savedRestaurant = await newRes.save();
        res.status(201).json({ 
            success: true, 
            message: "New Restaurant Created", 
            data: savedRestaurant 
        });
    }
    else {
        // Handle the case where no photo was uploaded
        return res.status(400).send({ success: false, error: "Photo is required" });
    }
}

async function deleteRestaurant(req, res) {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
        return res.status(404).send({ success: false, error: "Restaurant not found" });
    }
    res.status(200).send({ success: true, message: "Restaurant Deleted Successfully" });
}

async function getAllRestaurants(req, res) {
    const restaurants = await Restaurant.find({});
    if (!restaurants || restaurants.length === 0) {
        return res.status(404).send({ success: false, error: "No Restaurants found" });
    }
    res.status(200).json({ success: true, data: restaurants });
}

async function getRestaurantById(req, res) {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        return res.status(404).send({ success: false, error: "Restaurant not found" });
    }
    res.status(200).json({ success: true, data: restaurant });
}

async function updateRestaurantDetails(req, res) {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updatedRestaurant) {
        return res.status(404).send({ success: false, error: "Restaurant not found" });
    }
    res.status(202).send({ success: true, data: updatedRestaurant, message: "Restaurant Update Successfully" });
}

async function addMenuItem(req, res) {
    const currRes = await Restaurant.findOne({ user_id: req.user._id });
    if (!currRes) {
        return res.status(404).send({ success: false, error: "Restaurant Not found" });
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
    res.status(200).json({ success: true, message: "New Menu Item Created", newItem: response });
}

async function updateMenuItem(req, res) {
    const currUserId = req.user._id;
    if (!currUserId) {
        return res.status(404).send({ success: false, error: "User not found" });
    }

    const currRes = await Restaurant.findOne({ user_id: currUserId });
    if (!currRes) {
        return res.status(404).send({ succes: false, error: "Restaurant not Found" });
    }

    const { name, price, foodImgUrl, type } = req.body;
    if (!name & !price & !foodImgUrl & !type) {
        return res.status(400).send({ success: false, error: "Please provide necessary details" });
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
        return res.status(404).send({ success: false, error: "Menu item not found" });
    }

    res.status(202).json({ success: true, message: "Menu Item Updated", data: updatedMenuItem });
}

async function deleteMenuItem(req, res) {
    console.log("Delete method called");
    const orderId = req.params.id;
    const deletedRestaurant = await Restaurant.findOneAndUpdate(
        { user_id: req.user._id },
        { $pull: { menu: orderId } },
        { new: true }
    );
    if (!deletedRestaurant) {
        return res.status(404).send({ success: false, error: "Restaurant Not Found" });
    }
    const deletedOrder = await Food.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
        return res.status(404).send({ success: false, error: "Order Not Found" });
    }
    res.status(200).send({ success: true, message: "Menu Item Removed" });
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