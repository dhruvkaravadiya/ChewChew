const Order = require('../models/Order');
const DeliveryMan = require('../models/DeliveryMan');
const { getCoordinates } = require('../helpers/utils/getCordinates');
const { calculateDistance } = require("../helpers/utils/calculateDistance");

async function createDeliveryMan(req, res) {
      if (!req.body) {
            return res.status(400).send("Please Enter Necessary Details");
      }
      console.log(req.user);
      const cordinates = await getCoordinates();
      const newDeliveryMan = new DeliveryMan(
            {
                  ...req.body,
                  user_id: req.user.id,
                  currentLocation: {
                        latitude: cordinates.latitude,
                        longitude: cordinates.longitude
                  }
            }
      );
      const savedDeliveryMan = await newDeliveryMan.save();
      res.status(201).json(savedDeliveryMan);
}

async function deleteDeliveryMan(req, res) {
      const deletedDeliveryMan = await DeliveryMan.findByIdAndDelete(req.params.id);
      if (!deletedDeliveryMan) {
            return res.status(404).send("DeliveryMan not found");
      }
      res.status(200).send("DeliveryMan Deleted Successfully");
}

async function getAllDeliveryMan(req, res) {
      const allDeliveryMan = await DeliveryMan.find({});
      if (!allDeliveryMan || allDeliveryMan.length === 0) {
            return res.status(404).send("No DeliveryMans found");
      }
      res.status(200).json(allDeliveryMan);
}

async function getDeliveryManById(req, res) {
      const deliveryMan = await DeliveryMan.findById(req.params.id);
      if (!deliveryMan) {
            return res.status(404).send("delivery Man not found");
      }
      res.status(200).json(deliveryMan);
}

async function updateDeliveryManDetails(req, res) {
      const updatedDeliveryMan = await DeliveryMan.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      if (!updatedDeliveryMan) {
            return res.status(404).send("DeliveryMan not found");
      }
      res.status(200).send("DeliveryMan Update Successfully");
}
const updateLocation = async (req, res) => {
      const { id } = req.params;
      const deliveryMan = await DeliveryMan.findById(id);
      if (!deliveryMan) {
            return res.status(404).json({ error: 'Delivery person not found' });
      }
      const { latitude, longitude } = await getCoordinates();
      await deliveryMan.updateLocation(latitude, longitude);
      req.io.to(id).emit('locationUpdate', { id, latitude, longitude });
      return res.status(200).send({ success: true, message: 'Delivery updated successfully' });
};

const pickOrder = async (req, res) => {
      const { id } = req.params;
      // Find the order
      const order = await Order.findById(id);
      if (!order) {
            return res.status(404).json({ error: 'Order not found' });
      }
      // Find the delivery man
      const deliveryMan = await DeliveryMan.findOne({ user_id: req.user.id });
      if (!deliveryMan) {
            return res.status(404).json({ error: 'Delivery Man not found' });
      }

      console.log("Order : ", order);
      console.log("DeliveryMan : ", deliveryMan);

      // Check if the order status is "Prepared"
      if (order.orderStatus === "Prepared") {
            // Update the delivery man's currentOrders and the order's status
            await DeliveryMan.updateOne(
                  { _id: deliveryMan.id },
                  {
                        $push: {
                              currentOrders: {
                                    orderId: order._id,
                                    assignedTime: order.placedAt,
                                    restaurant: {
                                          id: order.restaurant.id,
                                          name: order.restaurant.name
                                    },
                                    orderStatus: "Picked",
                                    deliveryLocation: {
                                          latitude: order.deliveryLocation.latitude,
                                          longitude: order.deliveryLocation.longitude
                                    }
                              }
                        }
                  }
            );
            await Order.updateOne({ _id: order._id }, { $set: { orderStatus: "Picked" } });
            // Send a success response
            return res.status(201).json({ message: "Order Picked" });
      } else {
            // If the order status is not "Prepared", send an appropriate response
            return res.status(400).json({ error: 'Order is not prepared for picking' });
      }
};


const verifyOrder = async (req, res) => {
}

const getPastOrders = async (req, res) => {

}
module.exports = {
      createDeliveryMan,
      deleteDeliveryMan,
      getAllDeliveryMan,
      getDeliveryManById,
      updateDeliveryManDetails,
      updateLocation,
      pickOrder,
      verifyOrder,
      getPastOrders
};
