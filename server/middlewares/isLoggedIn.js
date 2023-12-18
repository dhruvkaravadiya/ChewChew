const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require('../config/appConfig');
const User = require('../models/User');

module.exports = isLoggedIn = async (req, res, next) => {
  try {
    console.log(req);
    const token = req.cookies.access_token || (req.header("Authorization") || "").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({success : false, error :"First Login to access this page"});
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      return res.status(401).json({success : false, error :"Invalid token"});
    }

    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    return res.status(500).json({success : false, error :"Internal server error"});
  }
};
