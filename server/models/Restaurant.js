const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
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

    restaurantName: {
      type: String,
      required: true,
      unique: true,
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
    menu: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Food",
        default: [],
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;
