const mongoose = require("mongoose");
const { OTP_EXPIRY } = require("../config/appConfig");
const orderSchema = mongoose.Schema({
      customer: {
            id: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "Customer",
                  required: true
            },
            name: {
                  type: String,
                  required: true
            }
      },
      restaurant: {
            id: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "Restaurant",
                  required: true
            },
            name: {
                  type: String,
                  required: true
            },
      },
      deliveryLocation: {
            latitude: Number,
            longitude: Number
      },
      items: [
            {
                  _id: false,
                  foodId: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: "Food",
                        required: true
                  },
                  foodName: {
                        type: String,
                        required: true
                  },
                  foodPrice: {
                        type: Number,
                        required: true
                  },
                  count: {
                        type: Number,
                        required: true
                  }
            }
      ],
      orderTotal: {
            type: Number,
            required: true,
            default: 0
      },
      paymentMethod: String,
      transactionId: String,
      paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
      },
      orderStatus: {
            type: String,
            enum: ["Placed", "Picked", "Prepared", "Delivered", "Completed", "Canceled"],
            default: 'Placed'
      },
      placedAt: {
            type: Date,
            default: Date.now
      },
      OTP: Number,
      OTPExpiry: String,
}, { versionKey: false, timeStamps: false });

orderSchema.methods.generateOTP = async function () {
      const otp = Math.floor(100000 + Math.random() * 900000);
      this.OTP = otp.toString();
      this.OTPExpiry = Date.now() + OTP_EXPIRY;
      return otp.toString();
}

orderSchema.methods.verifyOTP = async function (userProvidedOTP) {
      console.log(this.OTP);
      console.log(userProvidedOTP);
      return this.OTP === userProvidedOTP && Date.now() <= this.OTPExpiry;
}

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;