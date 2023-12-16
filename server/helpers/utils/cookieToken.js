const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRY, JWT_SECRET_KEY } = require("../../config/appConfig");
module.exports = cookieToken = async (user, res, message) => {
  console.log("Cookie User : ", user);
  const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY,
  });
  res
    .status(200)
    .cookie("access_token", token, { 
      expiresIn: new Date(Date.now() + TOKEN_EXPIRY),
    })
    .json({ success: true, token, user, message });
}
