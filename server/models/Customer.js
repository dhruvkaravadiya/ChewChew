const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    currentOrders:{

    },
    favRestaurants: {
        type:Array,
        default:[]
    }
});

const Customer = mongoose.model("Customer" , customerSchema);
module.exports = Customer;