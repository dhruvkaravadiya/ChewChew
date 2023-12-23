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
      type: String,
      required: [true, "Please enter the address"]
    },
    location:{
      latitude:String,
      longitude:String
    },
    photo: {
      id: {
          type: String,
      },
      photoUrl: {
          type: String,
      }
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
