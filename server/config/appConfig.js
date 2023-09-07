require("dotenv").config()

module.exports={
    DB_CONNECTION_STRING : process.env.DB_CONNECTION_STRING,
    PORT : process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
}
