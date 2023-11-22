const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
      customerId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Customer",
            required: true
      },
      restaurantId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Restaurant",
            required: true
      },
      customerName: {
            type: String,
            required: true
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
            enum: ["Placed", "Confirmed", "Prepared", "Delivered", "Completed", "Canceled"],
            default: 'Placed'
      },
      placedAt: { 
            type: Date,
            default: Date.now
      }
}, { versionKey: false });

orderSchema.addItemToCart = async function () {

}

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;