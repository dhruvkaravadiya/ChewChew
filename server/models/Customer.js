const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:[true, "User Not Registered"]
    },
    currentOrders:[
        {
            orderId : mongoose.SchemaTypes.ObjectId,
            ref: "Order"
        }
    ],
    pastOrders: [
        {
            orderId : mongoose.SchemaTypes.ObjectId,
            ref: "Order"
        }
    ],
    favRestaurants: {
        type:Array,
        default:[]
    },
    location: {
        latitude: String,
        longitude: String
    }
},{versionKey: false});

const Customer = mongoose.model("Customer" , customerSchema);
module.exports = Customer;