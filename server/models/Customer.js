const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    favRestaurants: {
        type:Array,
        default:[]
    }
});
