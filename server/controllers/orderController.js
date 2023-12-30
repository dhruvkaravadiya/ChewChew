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
const { startSession } = require('mongoose');
const { STRIPE_TEST_SECRET_KEY, LOCALHOST_ORIGIN } = require('../config/appConfig');
const { calculateOrderTotal } = require('../helpers/utils/calculateOrderTotal');
const stripe = require("stripe")(STRIPE_TEST_SECRET_KEY);


// PLACE A ORDER
async function createOrder(req, res) {
  const session = await Order.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
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
      // Validate req.body using the validation module
      const validationResult = validateOrder(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ success: false, errors: validationResult.errors });
      }
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
      const line_items = items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.foodName
          },
          unit_amount: item.foodPrice * 100
        },
        quantity: item.count
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        success_url: LOCALHOST_ORIGIN,
        cancel_url: LOCALHOST_ORIGIN
      });
      order.payment.sessionId = session.id
      const savedOrder = await order.save();

      // Add order to restaurant's orders
      await Restaurant.findByIdAndUpdate(restaurantId, { $push: { currentOrders: savedOrder._id } });

      // Add order to Customer's Current orders
      await Customer.findByIdAndUpdate(customer._id, { $push: { currentOrders: savedOrder._id } });
      //commit corrent transaction
      await session.commitTransaction();
      result = order;
    });


    res.status(201).json({
      success: true,
      data: { order: result, payementSessionId: session.id, paymentUrl: session.url },
      message: "Order Placed Successfully"
    });
  } catch (error) {
    // An error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error creating order:', error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
  finally {
    // End the session
    session.endSession();
  }
}

// UPDATE ORDER STATUS
async function updateOrderStatus(req, res) {
  const session = await Order.startSession();

  try {
    await session.withTransaction(async () => {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: "Restaurant Not Found" });
      }
      const { orderStatus } = req.body;
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({ success: false, error: "Order Not Found" });
      }
      if (order.orderStatus != "Placed") {
        return res.status(400).json({ success: false, error: "Order Status must be Placed" });
      }
      const allowedOrderStatuses = ["Prepared", "Preparing"];
      const isValidOrderStatus = allowedOrderStatuses.includes(orderStatus);
      if (!isValidOrderStatus) {
        return res.status(400).json({ success: false, error: "Invalid Order Status Value" });
      }
      const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { orderStatus } }, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ success: false, error: "Order Not Found" });
      }
      await session.commitTransaction();
    });
    res.status(221).json({ success: true, message: "Order Status Updated", orderstatus: updatedOrder.orderStatus });
  }
  catch (error) {
    await session.abortTransaction();
    console.error('Error Updating Order Status:', error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
  finally {
    // End the session
    session.endSession();
  }
}

// PICK THE ORDER
const pickOrder = async (req, res) => {
  const session = await Order.startSession();
  try {
    await session.withTransaction(async () => {
      const user = req.user;
      const { id } = req.params;
      // Find the order
      const order = await Order.findById(id);
      if (!order || order.orderStatus != "Prepared") {
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
        
      } else {
        return res.status(400).json({ success: false, error: 'Order is not prepared for picking' });
      }
      await session.commitTransaction();
    });
    res.status(201).json({ success: true, message: "Order Picked" });
  }
  catch (error) {
    await session.abortTransaction();
    console.error('Error Picking Order :', error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
  finally {
    // End the session
    session.endSession();
  }
};

// COMPLETE / VERIFY THE ORDER
const completeOrder = async (req, res) => {
  const session = await Order.startSession();

  try {
    await session.withTransaction(async () => {
      const orderId = req.params.id;
      const OTP = req.body.OTP;

      // Find the order
      const order = await Order.findById(orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      // Verify OTP
      const isOTPVerified = await order.verifyOTP(OTP);

      if (!isOTPVerified) {
        throw new Error('Invalid OTP');
      }

      // Update order status to "Completed"
      order.orderStatus = 'Completed';
      order.OTP = undefined;
      order.OTPExpiry = undefined;
      await order.save();

      // Move order from current orders to past orders for customer
      const updatedCustomer = await Customer.findByIdAndUpdate(order.customer.id, {
        $pull: { currentOrders: order._id },
        $push: { pastOrders: order._id },
      });
      if (!updatedCustomer) {
        throw new Error('Customer not updated');
      }

      // Move order from current orders to past orders for restaurant
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(order.restaurant.id, {
        $pull: { currentOrders: order._id },
        $push: { pastOrders: order._id },
        $inc: { income: (order.orderTotal - order.orderTotal / 10) }
      });
      if (!updatedRestaurant) {
        throw new Error('Restaurant not updated');
      }

      // Move order from current orders to delivery history for delivery man
      const updatedDeliveryMan = await DeliveryMan.findOneAndUpdate(
        { 'currentOrders.orderId': order._id },
        {
          $pull: { 'currentOrders': { orderId: order._id } },
          $push: { deliveryHistory: orderId },
          $inc: { earnings: order.orderTotal / 10 }
        }
      );
      if (!updatedDeliveryMan) {
        throw new Error('Delivery Man not updated');
      }

      await session.commitTransaction();
    });

    // Return success response
    return res.status(200).json({ success: true, message: 'Order completed successfully' });
  } catch (error) {
    // An error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error completing order:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};

// CANCEL THE ORDER
const cancelOrder = async (req, res) => {
  const session = await Order.startSession();

  try {
    await session.withTransaction(async () => {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      if (order.orderStatus !== 'Placed') {
        return res.status(400).json({ success: false, error: 'Order cannot be canceled' });
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(order.restaurant.id, {
        $pull: { currentOrders: order._id }
      });
      if (!updatedRestaurant) {
        return res.status(404).json({ success: false, error: "Restaurant not found" });
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(order.customer.id, {
        $pull: { currentOrders: order._id }
      });
      if (!updatedCustomer) {
        return res.status(404).json({ success: false, error: "Customer not found" });
      }

      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ success: false, error: "Order not deleted" });
      }

      // Commit the transaction here after successful deletion
      await session.commitTransaction();

      // Return success response after successful deletion
      return res.status(200).json({ success: true, message: "Order deleted successfully" });
    });
  } catch (error) {
    // An error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error canceling order:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
}

// GET PAST ORDERS
const getPastOrders = async (req, res) => {
  const deliveryManId = req.user._id;
  const deliveryMan = await DeliveryMan.findOne({ user_id: deliveryManId });
  if (!deliveryMan) {
    return res.status(404).json({ success: false, error: 'Delivery Peron Not Found' });
  }
  return res.status(200).json({ success: true, data: deliveryMan.deliveryHistory });
}

// GET CURRENT ORDERS
const getCurrentOrders = async (req, res) => {
  const deliveryManId = req.user._id;
  const deliveryMan = await DeliveryMan.findOne({ user_id: deliveryManId });
  if (!deliveryMan) {
    return res.status(404).json({ success: false, error: 'Delivery Peron Not Found' });
  }
  return res.status(200).json({ success: true, data: deliveryMan.currentOrders });
}

// GET PREPARED ORDERS
const getPreparedOrders = async (req, res) => {
  const preparedOrders = await Order.find({ orderStatus: "Prepared" });
  if (preparedOrders.length == 0) {
    return res.status(404).json({ success: false, error: 'No Prepared Orders' });
  }
  return res.status(200).json({ success: true, data: preparedOrders });
}

module.exports = {
  createOrder,
  updateOrderStatus,
  pickOrder,
  cancelOrder,
  completeOrder,
  getPastOrders,
  getCurrentOrders,
  getPreparedOrders
}