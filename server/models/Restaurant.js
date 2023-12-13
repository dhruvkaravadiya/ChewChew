const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, "Please enter Restaurant Name"],
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for references
      ref: "User", // Assuming User is the model name for restaurant owners
      required: [true, "Restaurant's Owner Id is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter Contact Number"],
      minlength: 10,
      unique: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Please enter Street"],
      },
      area: {
        type: String,
        required: [true, "Please enter Area"],
      },
      city: {
        type: String,
        required: [true, "Please enter City"],
      },
      state: {
        type: String,
        required: [true, "Please enter State"],
      },
      pincode: {
        type: String,
        required: [true, "Please enter Pincode"],
      },
    },
    imgUrl: {
      type: String,
      required: [true, "Please provide the Restaurant Image"],
      validate: {
        validator: function (value) {
          const urlRegex =
            /^(https?:\/\/)?([\w\d]+\.)?[\w\d]+\.\w{2,}\/?.*$/;
          return urlRegex.test(value);
        },
        message: "Invalid Image Url",
      },
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Food", 
      },
    ],
    currentOrders:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ],
    pastOrders:[
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

restaurantSchema.path("currentOrders").default([]);
restaurantSchema.path("pastOrders").default([]);

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;
