const mongoose = required("mongoose");

const deliveryManSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    delivery_area:{
        type:String,
    }
});