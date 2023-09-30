const express = require("express");
const app = express();
const Restaurants = require("../routes/Restaurants");
const Auths = require("../routes/Auths");

app.use("/api/restaurants", Restaurants);
app.use("/api/auth",Auths);
module.exports = app;
