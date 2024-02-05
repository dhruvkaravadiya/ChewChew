const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "User Id of Delivery Man is Required"],
            ref: "User",
        },
        restaurants: {
            type: [
                {
                    _id: false,
                    id: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: "Restaurant",
                        default: undefined,
                    },
                    name: {
                        type: String,
                        default: undefined,
                    },
                },
            ],
            validate: {
                validator: function (value) {
                    return value.length <= 3;
                },
                message:
                    "Cannot add more than 3 restaurants for a delivery man.",
            },
            max: 3,
            default: [],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please enter Contact Number"],
            minlength: 10,
            unique: true,
        },
        currentLocation: {
            latitude: Number,
            longitude: Number,
        },
        currentOrders: [
            {
                orderId: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "Order",
                },
                orderStatus: String,
                assignedTime: Date,
                restaurant: {
                    id: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: "Restaurant",
                    },
                    name: String,
                },
                deliveryLocation: {
                    latitude: Number,
                    longitude: Number,
                },
            },
        ],
        pastOrders: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Order",
            },
        ],
        cancelledOrders: {
            type: Number,
            default: 0,
        },
        earnings: {
            type: Number,
            default: 0,
        },
    },
    { versionKey: false }
);

//set the schema property array empty
deliveryManSchema.path("pastOrders").default([]);
deliveryManSchema.path("currentOrders").default([]);

// check if the current location changes or not
// before saving the updated object
deliveryManSchema.pre("save", async function (next) {
    if (this.isModified("currentLocation") === true) {
        const io = this.model("DeliveryMan").io;
        if (io) {
            // Emit the location update to the specific delivery man
            io.to(this._id).emit("deliveryLocationUpdate", {
                deliveryManId: this._id,
                location: {
                    latitude: this.currentLocation.latitude,
                    longitude: this.currentLocation.longitude,
                },
            });
        }
    }
    next();
});

deliveryManSchema.methods.updateLocation = async function (
    latitude,
    longitude
) {
    this.currentLocation = {
        latitude,
        longitude,
    };
    await this.save();
};

const DeliveryMan = mongoose.model("DeliveryMan", deliveryManSchema);
module.exports = DeliveryMan;
