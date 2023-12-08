const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieparser = require('cookie-parser');
const cors = require("cors");
const { DB_CONNECTION_STRING, PORT } = require("./config/appConfig");
const authRoutes = require('./routes/Auths');
const restaurantsRoutes = require("./routes/Restaurants");
const deliveryManRoutes = require("./routes/DeliveryMan");
const customerRoutes = require("./routes/Customer");
const orderRoutes = require("./routes/Order");
const fileUpload = require("express-fileupload");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

// Create an HTTP server
const server = http.createServer(app);

// Create a new instance of Socket.io and pass the server instance
const io = socketIo(server);

// io object configuration 
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("orderStatusUpdate", (data) => {
    // Broadcast the order status update to all connected clients
    io.emit("updateOrderStatus", data);
  });
  socket.on("disconnect", () => { console.log("A user disconnected") });
});

// temperory code
// const DeliveryMan = require("./models/DeliveryMan");
// //attach io to model
// DeliveryMan.io = io;


// middleware to attach io object to request handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose
  .connect(DB_CONNECTION_STRING, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Body Parser Middleware to parse data from the body to JSON
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable cross-origin resource sharing using cors() middleware
app.use(cors(
  {
    origin: "http://localhost:8080",
    credentials: true,
    methods: "GET,POST",
  }
));

// Cookie-parser middleware to parse data from Cookie
app.use(cookieparser());

// Configure the file upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// set real ip proxy trust settings
app.set('trust proxy', true);

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Setting the EJS view engine
app.set("view engine", "ejs");

// Routes
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deliveryman', deliveryManRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/order', orderRoutes);

app.get('/resboard', (req, res) => (
  res.render('resupdate')
));

app.get('/cusboard', (req, res) => (
  res.render('cusview')
));

// Signup form ejs
app.get('/api/auth/signup', (req, res) => {
  res.render("signupForm");
});

// // Update food status ejs
// app.get('/updatestatus/:id', (req, res) => {
//   console.log("index get method called for render");
//   res.render('updateFoodStatus' , { orderId: req.params.id });
// });

// // view food status ejs
// app.get('/viewstatus', (req, res) => {
//   res.render('viewFoodStatus');
// });

// // Handle POST request for signup
// app.post('/api/auth/signup', (req, res) => {
//   // Check if files were uploaded
//   if (!req.files || !req.files.photo) {
//     return res.status(400).send('No files were uploaded.');
//   }
//   console.log(req.files.photo);
//   const uploadedFile = req.files.photo;
//   console.log(uploadedFile);
//   // Respond to the client
//   res.send('Files uploaded successfully.');
// });

// Listen to the server
server.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});