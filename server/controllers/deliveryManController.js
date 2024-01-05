const Order = require('../models/Order');
const DeliveryMan = require('../models/DeliveryMan');
const Restaurant = require('../models/Restaurant');
const Customer = require('../models/Customer');
const { getCoordinates } = require('../helpers/utils/getCoordinates');
const { calculateDistance } = require("../helpers/utils/calculateDistance");

async function createDeliveryMan(req, res) {
      if (!req.body) {
            return res.status(400).json({ success: false, error: "Please Enter Necessary Details" });
      }
      const coordinates = await getCoordinates();
      const newDeliveryMan = new DeliveryMan(
            {
                  ...req.body,
                  user_id: req.user.id,
                  currentLocation: {
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                  }
            }
      );
      const savedDeliveryMan = await newDeliveryMan.save();
      res.status(201).json({ success: true, message: "Delivery Man Created", data: savedDeliveryMan });
}

async function deleteDeliveryMan(req, res) {
      const deletedDeliveryMan = await DeliveryMan.findByIdAndDelete(req.params.id);
      if (!deletedDeliveryMan) {
            return res.status(404).json({ success: false, error: "DeliveryMan not found" });
      }
      res.status(200).json({ success: true, message: "DeliveryMan Deleted Successfully" });
}

async function getAllDeliveryMan(req, res) {
      const allDeliveryMan = await DeliveryMan.find({});
      if (!allDeliveryMan || allDeliveryMan.length === 0) {
            return res.status(404).json({ success: false, error: "No DeliveryMans found" });
      }
      res.status(200).json({ success: true, data: allDeliveryMan });
}

async function getDeliveryManById(req, res) {
      const deliveryMan = await DeliveryMan.findById(req.params.id);
      if (!deliveryMan) {
            return res.status(404).json({success : false , message : "delivery Man not found"});
      }
      res.status(200).json({success : true, data : deliveryMan});
}

async function updateDeliveryManDetails(req, res) {
      const updatedDeliveryMan = await DeliveryMan.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      if (!updatedDeliveryMan) {
            return res.status(404).json({ success: false, error: "DeliveryMan not found" });
      }
      res.status(202).json({ success: true, message: "DeliveryMan Update Successfully" });
}
const updateLocation = async (req, res) => {
      const { id } = req.params;
      const deliveryMan = await DeliveryMan.findById(id);
      if (!deliveryMan) {
            return res.status(404).json({ success: false, error: 'Delivery person not found' });
      }
      const { latitude, longitude } = await getCoordinates();
      await deliveryMan.updateLocation(latitude, longitude);
      //req.io.to(id).emit('locationUpdate', { id, latitude, longitude });
      return res.status(202).json({ success: true, message: 'Delivery updated successfully' });
};

const getDistance  = async (req,res) => {
      
}

module.exports = {
      createDeliveryMan,
      deleteDeliveryMan,
      getAllDeliveryMan,
      getDeliveryManById,
      updateDeliveryManDetails,
      updateLocation,
};
