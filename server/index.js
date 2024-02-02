const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const {
    DB_CONNECTION_STRING,
    PORT,
    LOCALHOST_ORIGIN,
} = require("./config/appConfig");
const authRoutes = require("./routes/Auths");
const restaurantsRoutes = require("./routes/Restaurants");
const deliveryManRoutes = require("./routes/DeliveryMen");
const customerRoutes = require("./routes/Customers");
const orderRoutes = require("./routes/Orders");
const fileUpload = require("express-fileupload");
const path = require("path");

const { io, app, server, express } = require("./startup/io");

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
app.use(
    cors({
        origin: LOCALHOST_ORIGIN,
        credentials: true,
        methods: "GET,POST,DELETE,PUT",
    })
);

// Cookie-parser middleware to parse data from Cookie
app.use(cookieparser());

// Configure the file upload
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// set real ip proxy trust settings
app.set("trust proxy", true);

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Setting the EJS view engine
app.set("view engine", "ejs");

// Routes
app.use("/api/v1/restaurants", restaurantsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/deliveryman", deliveryManRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/order", orderRoutes);

app.get("/resboard", (req, res) => res.render("resupdate"));

app.get("/cusboard", (req, res) => res.render("cusview"));

// Signup form ejs
app.get("/api/auth/signup", (req, res) => {
    res.render("signupForm");
});

// Render the test.ejs template
app.get("/test", (req, res) => {
    res.render("test");
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

module.exports = io;
