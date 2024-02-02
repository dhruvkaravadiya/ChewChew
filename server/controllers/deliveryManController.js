const Order = require("../models/Order");
const DeliveryMan = require("../models/DeliveryMan");
const Restaurant = require("../models/Restaurant");
const Customer = require("../models/Customer");
const { getCoordinates } = require("../helpers/utils/getCoordinates");
const { calculateDistance } = require("../helpers/utils/calculateDistance");

async function createDeliveryMan(req, res) {
    if (!req.body) {
        return res
            .status(400)
            .json({ success: false, error: "Please Enter Necessary Details" });
    }
    const coordinates = await getCoordinates();
    const newDeliveryMan = new DeliveryMan({
        ...req.body,
        user_id: req.user.id,
        currentLocation: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        },
    });
    const savedDeliveryMan = await newDeliveryMan.save();
    res.status(201).json({
        success: true,
        message: "Delivery Man Created",
        data: savedDeliveryMan,
    });
}

async function deleteDeliveryMan(req, res) {
    const deletedDeliveryMan = await DeliveryMan.findByIdAndDelete(
        req.params.id
    );
    if (!deletedDeliveryMan) {
        return res
            .status(404)
            .json({ success: false, error: "DeliveryMan not found" });
    }
    res.status(200).json({
        success: true,
        message: "DeliveryMan Deleted Successfully",
    });
}

async function getAllDeliveryMan(req, res) {
    const allDeliveryMan = await DeliveryMan.find({});
    if (!allDeliveryMan || allDeliveryMan.length === 0) {
        return res
            .status(404)
            .json({ success: false, error: "No DeliveryMans found" });
    }
    res.status(200).json({ success: true, data: allDeliveryMan });
}

async function getDeliveryManById(req, res) {
    const deliveryMan = await DeliveryMan.findById(req.params.id);
    if (!deliveryMan) {
        return res
            .status(404)
            .json({ success: false, message: "delivery Man not found" });
    }
    res.status(200).json({ success: true, data: deliveryMan });
}

async function updateDeliveryManDetails(req, res) {
    const updatedDeliveryMan = await DeliveryMan.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!updatedDeliveryMan) {
        return res
            .status(404)
            .json({ success: false, error: "DeliveryMan not found" });
    }
    res.status(202).json({
        success: true,
        message: "DeliveryMan Update Successfully",
    });
}
const updateLocation = async (req, res) => {
    const { id } = req.params;
    const deliveryMan = await DeliveryMan.findById(id);
    if (!deliveryMan) {
        return res
            .status(404)
            .json({ success: false, error: "Delivery person not found" });
    }
    const { latitude, longitude } = await getCoordinates();
    await deliveryMan.updateLocation(latitude, longitude);
    //req.io.to(id).emit('locationUpdate', { id, latitude, longitude });
    return res
        .status(202)
        .json({ success: true, message: "Delivery updated successfully" });
};

const addRestaurantToDeliveryMan = async (req, res) => {
    const { resIds } = req.body;
    try {
        const deliveryMan = await DeliveryMan.findOne({ user_id: req.user.id });

        if (!deliveryMan) {
            return res.status(404).json({
                success: false,
                error: "DeliveryMan not found",
            });
        }

        if (deliveryMan.restaurants.length === 3) {
            return res.status(400).json({
                success: false,
                error: "DeliveryMan can be associated with a maximum of 3 restaurants",
            });
        }

        const existingRestaurantIds = deliveryMan.restaurants.map(
            (restaurant) => restaurant.id
        );

        // Check if any of the selected restaurant IDs already exist in the delivery man's restaurants list
        const overlap = resIds.some((id) => existingRestaurantIds.includes(id));
        if (overlap) {
            return res.status(400).json({
                success: false,
                error: "DeliveryMan is already associated with one or more of the selected restaurants",
            });
        }

        // Fetch restaurant details using the provided IDs
        const restaurantsToAdd = await Restaurant.find({
            _id: { $in: resIds },
        });
        // Add new restaurant IDs and names to the delivery man's restaurants list
        const updatedDeliveryMan = await DeliveryMan.findOneAndUpdate(
            { user_id: req.user.id },
            {
                $push: {
                    restaurants: {
                        $each: restaurantsToAdd.map(
                            ({ _id, restaurantName }) => ({
                                id: _id,
                                name: restaurantName,
                            })
                        ),
                    },
                },
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Successfully added restaurant(s) to DeliveryMan",
            data: updatedDeliveryMan,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

const getDistance = async (req, res) => {};

module.exports = {
    createDeliveryMan,
    deleteDeliveryMan,
    getAllDeliveryMan,
    getDeliveryManById,
    updateDeliveryManDetails,
    updateLocation,
    addRestaurantToDeliveryMan,
};
