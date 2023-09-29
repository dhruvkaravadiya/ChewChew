const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require('cookie-parser');
const cors = require("cors");
const { DB_CONNECTION_STRING,PORT } = require("./config/appConfig"); 
const authRoutes = require('./routes/Auths');
const restaurantsRoutes = require("./routes/Restaurants");
const fileUpload = require("express-fileupload");
const path = require("path");

mongoose
  .connect(DB_CONNECTION_STRING, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

//configure the file upload
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

// Setting the EJS view engine
app.set("view engine", "ejs");

// Enable cross-origin resource sharing using cors() middleware
app.use(cors());

// Cookie-parser middleware to parse data from Cookie
app.use(cookieparser());

// Body Parser Middleware to parse data from the body to JSON
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/auth", authRoutes);

app.get('/api/auth/signup', (req, res) => {
  res.render("signupForm");
});

app.post('/api/auth/signup', (req, res) => {
  // Check if files were uploaded
  if (!req.files || !req.files.photo) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.files.photo);
  const uploadedFile = req.files.photo;
  console.log(uploadedFile);
  // Respond to the client
  res.send('Files uploaded successfully.');
});

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
