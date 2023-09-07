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
});

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
