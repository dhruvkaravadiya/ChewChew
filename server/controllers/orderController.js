const Order = require("../models/Order");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryMan = require("../models/DeliveryMan");
const Customer = require("../models/Customer");
const { Server } = require("socket.io");
const { getCordinates } = require("../helpers/utils/getCordinates");
const { sendEmailToGmail } = require("../helpers/mailer/mailer");
const fs = require("fs");
const path = require("path");

//create a new Order
async function createOrder(req, res) {
  try {
    const customer = await Customer.findOne({ user_id: req.user.id });
    if (!customer) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: true, message: "Restaurant not found!" });
    }

    const cordinates = await getCordinates();
    const { items, paymentMethod, orderStatus } = req.body;
    let orderTotal = 0;
    items.forEach((item) => {
      orderTotal += item.count * item.foodPrice;
    });

    const order = new Order({
      customer: {
        id: customer._id,
        name: req.user.name,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
      },
      deliveryLocation: {
        latitude: cordinates.latitude,
        longitude: cordinates.longitude,
      },
      items,
      orderTotal,
      paymentMethod,
      orderStatus,
      placedAt: new Date(),
    });

    const savedOrder = await order.save();

    // Add order to restaurant's orders
    await Restaurant.findByIdAndUpdate(restaurantId, { $push: { currentOrders: savedOrder._id } });

    // Add order to Customer's Current orders
    await Customer.findByIdAndUpdate(customer._id, { $push: { currentOrders: savedOrder._id } });

    return res.status(201).json({ success: true, data: order, message: "Order Placed Successfully" });
  } catch (error) {
    console.error('Error creating order:', error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

// Controller agrees to implement the function called "initializeSocket"
function initializeSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('updatedStatus', (newStatus) => {
      try {
        io.emit('updatedStatus', newStatus);
        updateOrderStatus();
      } catch (error) {
        console.error('Error emitting updatedStatus event:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

async function updateOrderStatus(req, res) {
  console.log('controller update order function called');
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: "Restaurant Not Found" });
  }
  const { orderStatus } = req.body;
  const orderId = req.params.id;
  const allowedOrderStatuses = ["Prepared", "Preparing"];
  const isValidOrderStatus = allowedOrderStatuses.includes(orderStatus);
  if (!isValidOrderStatus) {
    return res.status(400).json({ success: false, error: "Invalid Order Status Value" });
  }
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { orderStatus } }, { new: true });

  if (!updatedOrder) {
    return res.status(404).json({ success: false, error: "Order Not Found" });
  }
  return res.status(221).json({ success: true, message: "Order Status Updated", orderstatus: updatedOrder.orderStatus });
}

const pickOrder = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  // Find the order
  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  // const customer = Customer.findById(order.customer.id);
  // Find the delivery man
  const deliveryMan = await DeliveryMan.findOne({ user_id: user.id });
  if (!deliveryMan) {
    return res.status(404).json({ success: false, error: 'Delivery Man not found' });
  }
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
    const OTP = await order.generateOTP();

    await order.save();

    const htmlFilePath = path.join(
      __dirname,
      "../helpers/mailer/OTP_Code.html"
    );
    const otpTemplate = fs.readFileSync(htmlFilePath, "utf-8");
    await sendEmailToGmail({
      email: "karavadiadhruv22@gmail.com",
      subject: "OTP for Delivery Verification",
      html: otpTemplate.replace('{{otp}}', OTP)
    });
    await Order.updateOne({ _id: order._id }, { $set: { orderStatus: "Picked" } });
    return res.status(201).json({ success: true, message: "Order Picked" });
  } else {
    return res.status(400).json({ success: false, error: 'Order is not prepared for picking' });
  }
};

const completeOrder = async (req, res) => {
  const orderId = req.params.id;
  const OTP = req.body.OTP;

  // Find the order
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Verify OTP
  const isOTPVerified = await order.verifyOTP(OTP);

  if (!isOTPVerified) {
    return res.status(400).json({ success: false, error: 'Invalid OTP' });
  }

  // Update order status to "Completed"
  order.orderStatus = 'Completed';
  order.OTP = undefined;
  order.OTPExpiry = undefined;
  await order.save();

  // Move order from current orders to past orders for customer
  await Customer.findByIdAndUpdate(order.customer.id, {
    $pull: { currentOrders: order._id },
    $push: { pastOrders: order._id },
  });

  // Move order from current orders to past orders for restaurant
  await Restaurant.findByIdAndUpdate(order.restaurant.id, {
    $pull: { currentOrders: order._id },
    $push: { pastOrders: order._id },
  });
  // Move order from current orders to delivery history for delivery man
  await DeliveryMan.findOneAndUpdate(
    { 'currentOrders.orderId': order._id },
    {
      $pull: { 'currentOrders': { orderId: order._id } },
      $push: { deliveryHistory: orderId },
    }
  );
  // Return success response
  return res.status(200).json({ success: true, message: 'Order completed successfully' });
};

const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findOne(orderId);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  if (order.orderStatus != 'Placed') {
    return res.status(404).json({success : false, error: ''});
  }
  const cancelStatus = req.body.orderStatus;
  if (!cancelStatus) {
    return res.status(400).json({ success: false, error: "Please enter the status" });
  }
  if (cancelStatus != "Canceled") {
    return res.status(400).json({ success: false, error: "Provide correct status" });
  }
  const updatedRestaurant = await Restaurant.findOneAndUpdate(order.restaurant.id, {
    $pull: { currentOrders: order._id }
  });
  if(!updatedRestaurant){
    return res.status(404).json({ success: false, error: "Restaurant not found"});
  }
  const updatedCustomer = await Customer.findOneAndUpdate(order.customer.id, {
    $pull: { currentOrders: order._id }
  });
  if(!updatedCustomer){
    return res.status(404).json({success : false, error : "Customer not found"});
  }
  const updatedDeliveryMan = await DeliveryMan.findOneAndUpdate(
    { 'currentOrders.orderId': order._id },
    {
      $pull: { 'currentOrders': { orderId: order._id } }
    });
    if(!updatedDeliveryMan){
      return res.status(404).json({success : false, error: "Delivery Man not found"});
    }

  const deletedOrder = await Order.findByIdAndDelete(orderId);
  if(!deletedOrder){
    return res.status(404).json({success:false, error : "Order not deleted"});
  }
  res.status(204).json({success : true , message : "Order deleted successfully"});
}

const getPastOrders = async (req, res) => {
  const deliveryManId = req.user._id;
  const deliveryMan = await DeliveryMan.findOne({ user_id: deliveryManId });
  if (!deliveryMan) {
    return res.status(404).json({ success: false, error: 'Delivery Peron Not Found' });
  }
  return res.status(200).json({ success: true, data: deliveryMan.deliveryHistory });
}

const getCurrentOrders = async (req, res) => {
  const deliveryManId = req.user._id;
  const deliveryMan = await DeliveryMan.findOne({ user_id: deliveryManId });
  if (!deliveryMan) {
    return res.status(404).json({ success: false, error: 'Delivery Peron Not Found' });
  }
  return res.status(200).json({ success: true, data: deliveryMan.currentOrders });
}

const getPreparedOrders = async (req, res) => {
  const preparedOrders = await Order.find({ orderStatus: "Prepared" });
  if (preparedOrders.length == 0) {
    return res.status(204).json({ success: false, error: 'No Prepared Orders' });
  }
  return res.status(200).json({ success: true, data: preparedOrders });
}
module.exports = {
  initializeSocket,
  createOrder,
  updateOrderStatus,
  pickOrder,
  cancelOrder,
  completeOrder,
  getPastOrders,
  getCurrentOrders,
  getPreparedOrders
}