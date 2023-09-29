const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require('../config/appConfig');
const User = require('../models/User');

module.exports = isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || (req.header("Authorization") || "").replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("First Login to access this page");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      return res.status(401).send("Invalid token");
    }

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    return res.status(500).send("Internal server error");
  }
};
