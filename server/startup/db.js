const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("../config/appConfig");

mongoose
  .connect(DB_CONNECTION_STRING, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });
