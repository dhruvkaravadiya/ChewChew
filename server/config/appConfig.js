require("dotenv").config()

module.exports={
    DB_CONNECTION_STRING : process.env.DB_CONNECTION_STRING,
    PORT : process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FORGOT_PASSWORD_EXPIRY: process.env.FORGOT_PASSWORD_EXPIRY,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY
}
