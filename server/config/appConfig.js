require("dotenv").config()

module.exports={
    DB_CONNECTION_STRING : process.env.DB_CONNECTION_STRING,
    PORT : process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FORGOT_PASSWORD_EXPIRY: process.env.FORGOT_PASSWORD_EXPIRY,
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PASS: process.env.SMTP_PASS,
    GMAIL_EMAIL_ID:process.env.GMAIL_EMAIL_ID,
    GMAIL_APP_PASSWORD:process.env.GMAIL_APP_PASSWORD,
    CLOUDINARY_NAME:process.env.CLOUDINARY_NAME,
    CLOUDINARY_API:process.env.CLOUDINARY_API,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET
}