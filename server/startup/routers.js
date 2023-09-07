const express = require("express");
const app = express();
const Restaurants = require("../routes/Restaurants");

app.use("/api", Restaurants);

module.exports = app;
