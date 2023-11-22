const Order = require("../models/Order");
const User = require("../models/User");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const { Server } = require("socket.io");

//create a new Order
async function createOrder(req, res) {
    console.log("Method called");
    console.log(req.user.id);
    const customerId = req.user.id;
    const customer = await User.findById(customerId);
    if (!customer) {
        return res.status(404).send("User not found");
    }
    const restaurantId = req.params.id;
    console.log(req.params.id);
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).send("Restaurant not found!");
    }
    const { items, paymentMethod, orderStatus } = req.body;
    let orderTotal = 0;
    items.forEach((item) => {
        orderTotal += item.count * item.foodPrice;
    });

    const order = new Order({
        customerId,
        restaurantId,
        customerName: customer.name,
        items,
        orderTotal,
        paymentMethod,
        orderStatus,
        placedAt: new Date(),
    });
    await order.save();
    await Restaurant.findByIdAndUpdate(restaurantId, { $push: { orders: order._id } });
    return res.status(201).send({ "success": true, "order": order, "message": "Order Placed Successfully" });
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

async function updateOrderStatus(io, req, res) {
  console.log('controller update order function called'); 
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send("Restaurant Not Found");
  }
  const { orderStatus } = req.body;
  const orderId = req.params.id;

  const isValidOrderStatus = Order.schema.path("orderStatus").enumValues.includes(orderStatus);
  if(!isValidOrderStatus){
    return res.status(400).send("Invalid Order Status Value");
  }
  const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { orderStatus } }, { new: true });

  if (!updatedOrder) {
    return res.status(404).send("Order Not Found");
  }

  io.emit("updatedStatus", { orderId, newStatus: orderStatus });
  return res.status(201).json({ "success": true, "orderstatus": updatedOrder.orderStatus });
}

module.exports = {
  initializeSocket,
  createOrder,
  updateOrderStatus
}