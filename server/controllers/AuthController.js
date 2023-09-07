const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/appConfig");

async function restaurantSignUp(req, res) {
  try {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newRestaurant = new Restaurant({ ...req.body, password: hash });
    await newRestaurant.save();
    console.log(req.body);
    res.status(200).send("Restaurant Created Successfully");
  } catch (err) {
    return res.status(404).send(err.message);
  }
}

async function restaurantLogin(req, res) {
  const restaurant = await Restaurant.findOne({
    $or: [{ name: req.body.name }, { email: req.body.email }],
  });
  if (!restaurant) {
    return res.status(404).send("User Not Found");
  }
  const isCorrect = await bcrypt.compare(
    req.body.password,
    restaurant.password
  );
  if (!isCorrect) {
    return res.status(400).send("Wrong Credentials");
  }
  const token = jwt.sign({ id: restaurant._id }, JWT_SECRET_KEY);
  const { password, ...otherProperties } = restaurant._doc;
  console.log("Login Success");
  res.cookie("access_token", token, { httpOnly: true }).status(200).json(otherProperties);
}
module.exports = {
  restaurantSignUp,
  restaurantLogin,
};