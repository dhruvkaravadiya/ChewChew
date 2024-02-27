const mongoose = require("mongoose");
const { OTP_EXPIRY } = require("../config/appConfig");
const orderSchema = mongoose.Schema(
    {
        customer: {
            id: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Customer",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
        restaurant: {
            id: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Restaurant",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
        deliveryManId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "DeliveryMan",
        },
        deliveryLocation: {
            latitude: Number,
            longitude: Number,
        },
        restaurantLocation: {
            latitude: Number,
            longitude: Number,
        },
        items: [
            {
                _id: false,
                Id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "Food",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        orderTotal: {
            type: Number,
            required: true,
            default: 0,
        },
        payment: {
            sessionId: String,
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        orderStatus: {
            type: String,
            enum: [
                "Placed",
                "Preparing",
                "Prepared",
                "Picked",
                "Completed",
                "Canceled",
            ],
            default: "Placed",
        },
        placedAt: {
            type: Date,
            default: Date.now,
        },
        OTP: Number,
        OTPExpiry: String,
    },
    { versionKey: false, timeStamps: false }
);

orderSchema.methods.generateOTP = async function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.OTP = otp;
    this.OTPExpiry = (Date.now() + OTP_EXPIRY).toString();
    return otp;
};

orderSchema.methods.verifyOTP = async function (userProvidedOTP) {
    return this.OTP === userProvidedOTP && Date.now() <= this.OTPExpiry;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
