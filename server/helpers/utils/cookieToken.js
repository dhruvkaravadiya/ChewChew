const jwt = require("jsonwebtoken");
const {
    TOKEN_EXPIRY,
    JWT_SECRET_KEY,
    COOKIE_MAX_AGE,
} = require("../../config/appConfig");

module.exports = async function cookieToken(user, res, message) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: TOKEN_EXPIRY,
    });

    await res.cookie("access_token", token, {
        expiresIn: new Date(Date.now() + TOKEN_EXPIRY),
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        sameSite: "none",
        secure: true,
    });
    await res.status(200).json({ success: true, token, user, message });
};
