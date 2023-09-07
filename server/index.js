const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require('cookie-parser');
const { DB_CONNECTION_STRING } = require("./config/appConfig");
const { PORT } = require("./config/appConfig");
const authRoutes = require('./routes/Auths');
const restaurantsRoutes = require("./routes/Restaurants");

mongoose
  .connect(DB_CONNECTION_STRING, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Use cookie-parser middleware
app.use(cookieparser());
//Use Body Parser Middleware
app.use(express.json());
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
