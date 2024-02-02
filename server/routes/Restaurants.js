const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const isLoggedIn = require("../middlewares/isLoggedIn");
const verifyRole = require("../middlewares/verifyRole");
const Order = require("../models/Order");
//create restaurant
router.post(
    "/create",
    isLoggedIn,
    verifyRole("Restaurant"),
    asyncErrorHandler(restaurantController.createRestaurant)
);
//delete restaurant
router.delete(
    "/delete/:id",
    isLoggedIn,
    verifyRole("Restaurant"),
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
//remove menu item
router.delete(
    "/menu/delete/:id",
    isLoggedIn,
    verifyRole("Restaurant"),
    asyncErrorHandler(restaurantController.deleteMenuItem)
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

// get menu items
router.get(
    "/menu/items/:id",
    asyncErrorHandler(restaurantController.fetchmenuItems)
);

module.exports = router;
