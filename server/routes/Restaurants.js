const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const orderController = require("../controllers/orderController");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const isLoggedIn = require("../middlewares/isLoggedIn");
const verifyRole = require("../middlewares/verifyRole");
const Order = require("../models/Order");
//create restaurant
router.post(
  "/create",
  isLoggedIn,
  asyncErrorHandler(restaurantController.createRestaurant)
);
//delete restaurant
router.delete(
  "/delete/:id",
  isLoggedIn,
  asyncErrorHandler(restaurantController.deleteRestaurant)
);
//get all restaurants
router.get("/", asyncErrorHandler(restaurantController.getAllRestaurants));
//get restaurants by id
router.get(
  "/find/:id",
  asyncErrorHandler(restaurantController.getRestaurantById)
);
//update restaurant by id
router.put(
  "/edit/:id",
  isLoggedIn,
  verifyRole("Restaurant"),
  asyncErrorHandler(restaurantController.updateRestaurantDetails)
);
//add menu item
router.post(
  "/menu/add",
  isLoggedIn,
  verifyRole("Restaurant"),
  asyncErrorHandler(restaurantController.addMenuItem)
);
//update menu item
router.put(
  "/menu/update/:id",
  isLoggedIn,
  verifyRole("Restaurant"),
  asyncErrorHandler(restaurantController.updateMenuItem)
);
//delte menu item
router.put(
  "/menu/delete/:id",
  isLoggedIn,
  verifyRole("Restaurant"),
  asyncErrorHandler(restaurantController.deleteMenuItem)
);
//place order
router.post(
  "/placeorder/:id",
  isLoggedIn,
  verifyRole("Customer"),
  asyncErrorHandler(orderController.createOrder)
);
//update order status
router.put(
  "/order/update/:id",
  isLoggedIn,
  verifyRole("Restaurant"),
  asyncErrorHandler(orderController.updateOrderStatus)
);
// ejs render
router.get("/order/update/:id", (req, res) => {
  try {
    const orderId = req.params.id;
    const order = Order.findById(orderId);
    const orderStatus = order.orderStatus;
    res.render("updateFoodStatus", { orderId, orderStatus });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
