const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
      userId: {
            type: String,
            ref: "Customer",
            required: true
      },
      customerName: {
            type: String,
            required: true
      },
      items: [
            {
                  foodId: {
                        type: mongoose.Schema.Types.ObjectId, // Assuming foodId is an ObjectId
                        ref: "Food" // Assuming "Food" is another mongoose model
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
});

orderSchema.addItemToCart = async function () {

}

const Order = mongoose.model("Order", orderSchema); 
module.exports = Order;