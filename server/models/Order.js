const mongoose = require("mongoose");

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
      opt: String,
}, { versionKey: false, timeStamps: false });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;