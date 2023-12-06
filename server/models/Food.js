const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  foodImgUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Veg", "Non-Veg"],
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
  restaurant: {
    resId: {
      type: mongoose.SchemaTypes.ObjectId, 
      ref: "Restaurant", 
      required: true,
    },
    resName: {
      type: String,
      required: true,
    },
  },
},{versionKey: false});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
