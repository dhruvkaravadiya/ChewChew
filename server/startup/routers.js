const express = require("express");
const app = express();
const restaurantsRoutes = require("../routes/Restaurants");
const authRoutes = require("../routes/Auths");
const deliveryManRoutes = require("../routes/DeliveryMen");
const customerRoutes    = require("../routes/Customers");
const orderRoutes = require("../routes/Orders");

module.exports = function (req, res, next) {
      return () => {
            app.use('/api/restaurants', restaurantsRoutes);
            app.use('/api/auth', authRoutes);
            app.use('/api/deliveryman', deliveryManRoutes);
            app.use('/api/customer', customerRoutes);
            app.use('/api/order', orderRoutes);
      }
}