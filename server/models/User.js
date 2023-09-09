const mongoose = require('mongoose');
const roles = ["Restaurant", "DeliveryMan", "Customer"];
const crypto = require('crypto');
const { FORGOT_PASSWORD_EXPIRY } = require("../config/appConfig");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        maxlength: [40, "Name should be under 40 characters"]
    },
    email: {
        type: String,
        require: [true, "Please enter email"],
        validate: {
            validator: (value) => {
                return /\S+@\S+\.\S+/.test(value);
            },
            message: 'Invalid email address',
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: [8, "Password should be atleast 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: roles,
        default: 'Customer'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
}, { timestamps: true, versionKey: false });

userSchema.methods.verifyPassword = async function (pass) {
    await bcrypt.compare(pass, this.password);
    if (!isCorrect) {
        return res.status(400).send("Wrong Credentials");
    }
}

userSchema.methods.generateToken = function (user) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: TOKEN_EXPIRY,
    });
    return token;
}

userSchema.methods.createHashedPassword = function (pass) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
}

userSchema.methods.getForgotPasswordToken = function () {
    const tokenString = crypto.randomBytes(25).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').update(tokenString).digest('hex');
    this.forgotPasswordExpiry = Date.now() + FORGOT_PASSWORD_EXPIRY;
    return tokenString;
}

const User = mongoose.model("users", userSchema);

// exports.validate = validateUser;
module.exports = User;

/*
GET_FORGOT_PASSWORD_TOKEN
/1. first generate random string to return to user
 2. but we will store the hashed token in the database
 3. set token expiry
 4. now return this token
     when user will send this token back then
     we will compare with the hashed token we store
     then only allow the execution further for password change
*/

// const validateUser = (user) =>{
//     const schema = Joi.object({
//         name : Joi.string().min(5).max(50).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(8).max(1024).required(),
//         role: Joi.any().valid(...roles)
//     });
//     schema.validate(user);
// }