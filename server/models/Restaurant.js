const mongoose = require("mongoose");
const foodSchema = require("./Food");

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    imgUrl: {
      type: String,
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
    password:{
      type:String,
      required:true,
      min:8,
      max:16,
    },
    menu: [
      {
        type: mongoose.SchemaTypes.ObjectId,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;
