const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const { getCoordinates } = require("../helpers/utils/getCoordinates");

const {
    CLOUDINARY_NAME,
    CLOUDINARY_API,
    CLOUDINARY_API_SECRET,
} = require("../config/appConfig");

cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API,
    api_secret: CLOUDINARY_API_SECRET,
});

async function createRestaurant(req, res) {
    const existingUser = await Restaurant.findOne({ user_id: req.user._id });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: "Restaurant already exists for current User ",
        });
    }
    const {
        address,
        restaurantName,
        phoneNumber,
        cuisines,
        quickDescription,
        detailedDescription,
        openingHours,
        closingHours,

        deliveryCharges,
    } = req.body;
    if (
        !address ||
        !restaurantName ||
        !phoneNumber ||
        !cuisines ||
        !quickDescription ||
        !detailedDescription ||
        !openingHours ||
        !closingHours ||
        !deliveryCharges
    ) {
        return res.status(200).json({
            success: false,
            error: "Please Enter Necessary Details",
        });
    }

    if (req.files && req.files.photo) {
        const file = req.files.photo;

        // Step 2: Upload the photo to Cloudinary
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "FOA_Restaurants",
            width: 150,
            public_id: file.name,
        });
        const photoId = result.public_id;
        const photoUrl = result.secure_url;
        const cuisinesList = cuisines.split(",");
        const coordinates = await getCoordinates();
        const newRes = new Restaurant({
            user_id: req.user._id,
            restaurantName,
            phoneNumber,
            address,
            cuisines: cuisinesList,
            quickDescription,
            detailedDescription,
            openingHours,
            closingHours,
            deliveryCharges,
            location: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            },
            photo: {
                id: photoId,
                photoUrl: photoUrl,
            },
        });
        const savedRestaurant = await newRes.save();
        res.status(201).json({
            success: true,
            message: "New Restaurant Created",
            data: savedRestaurant,
        });
    } else {
        // Handle the case where no photo was uploaded
        return res
            .status(400)
            .json({ success: false, error: "Photo is required" });
    }
}

async function deleteRestaurant(req, res) {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant not found" });
    }
    res.status(200).json({
        success: true,
        message: "Restaurant Deleted Successfully",
    });
}

async function getAllRestaurants(req, res) {
    const restaurants = await Restaurant.find({});
    if (!restaurants || restaurants.length === 0) {
        return res
            .status(404)
            .json({ success: false, error: "No Restaurants found" });
    }
    res.status(200).json({ success: true, data: restaurants });
}

async function getRestaurantById(req, res) {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant not found" });
    }
    res.status(200).json({ success: true, data: restaurant });
}

async function updateRestaurantDetails(req, res) {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!updatedRestaurant) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant not found" });
    }
    res.status(202).json({
        success: true,
        data: updatedRestaurant,
        message: "Restaurant Update Successfully",
    });
}

async function addMenuItem(req, res) {
    const currRes = await Restaurant.findOne({ user_id: req.user._id });
    if (!currRes) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant Not found" });
    }

    const { name, price, type } = req.body;
    if (!name || !price || !type) {
        return res
            .status(400)
            .json({ success: false, error: "Please enter necesarry details" });
    }
    if (req.files && req.files.photo) {
        const foodImg = req.files.photo;
        const result = await cloudinary.v2.uploader.upload(
            foodImg.tempFilePath,
            {
                folder: "FOA_Food_Items",
                width: 150,
                public_id: foodImg.name,
            }
        );
        const newItem = new Food({
            name,
            price,
            foodImg: {
                id: result.public_id,
                url: result.secure_url,
            },
            type,
            restaurant: {
                resId: currRes._id,
                resName: currRes.restaurantName,
            },
        });
        const response = await newItem.save();
        await Restaurant.findByIdAndUpdate(currRes._id, {
            $push: { menu: response._id },
        });
        res.status(200).json({
            success: true,
            message: "New Menu Item Created",
            newItem: response,
        });
    } else {
        return res
            .status(400)
            .json({ success: false, error: "Provide the food image" });
    }
}

async function updateMenuItem(req, res) {
    const foodId = req.params.id;
    if (!foodId) {
        return res
            .status(400)
            .json({ success: false, error: "Provide the food id" });
    }
    const food = await Food.findById(foodId);
    if (!food) {
        return res
            .status(404)
            .json({ success: false, error: "Food Item not found" });
    }
    const currUserId = req.user._id;
    if (!currUserId) {
        return res
            .status(404)
            .json({ success: false, error: "User not found" });
    }
    const currRes = await Restaurant.findOne({ user_id: currUserId });
    if (!currRes) {
        return res
            .status(404)
            .json({ succes: false, error: "Restaurant not Found" });
    }

    const { name, price, type } = req.body;
    if (!name || !price || !type) {
        return res.status(400).json({
            success: false,
            error: "Please provide necessary details",
        });
    }
    const newFood = {
        name,
        price,
        type,
    };
    if (req.files && req.files.photo) {
        const foodImgId = food.foodImg.id;
        if (foodImgId) {
            await cloudinary.v2.uploader.destroy(foodImgId);
        }
        const result = await cloudinary.v2.uploader.upload(
            req.files.photo.tempFilePath,
            {
                folder: "FOA_Food_Items",
                width: 150,
                crop: "scale",
            }
        );

        newFood.foodImg = {
            id: result.public_id,
            url: result.secure_url,
        };
    } else {
        return res
            .status(404)
            .json({ succes: false, error: "Please provide food image" });
    }

    const updatedMenuItem = await Food.findByIdAndUpdate(
        req.params.id,
        {
            $set: newFood,
        },
        { new: true }
    );
    if (!updatedMenuItem) {
        return res
            .status(404)
            .json({ success: false, error: "Menu item not found" });
    }
    res.status(202).json({
        success: true,
        message: "Menu Item Updated",
        data: updatedMenuItem,
    });
}

async function deleteMenuItem(req, res) {
    const orderId = req.params.id;
    const deletedRestaurant = await Restaurant.findOneAndUpdate(
        { user_id: req.user._id },
        { $pull: { menu: orderId } },
        { new: true }
    );
    if (!deletedRestaurant) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant Not Found" });
    }
    const deletedOrder = await Food.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
        return res
            .status(404)
            .json({ success: false, error: "Order Not Found" });
    }
    res.status(200).json({ success: true, message: "Menu Item Removed" });
}

const fetchmenuItems = async (req, res) => {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
    }
    // Fetch menu items using the object IDs stored in the menuItems array
    const menuItems = await Food.find({ _id: { $in: restaurant.menu } });

    res.status(200).json({
        succcess: true,
        message: "Menu Item Fetched successfully",
        data: menuItems,
    });
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurantDetails,
    deleteRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchmenuItems,
};
