const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: [true, "User Id of Delivery Man is Required"],
            ref: "User",
        },
        restaurants: [
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
                _id: false,
                type: mongoose.SchemaTypes.ObjectId,
                ref: "Order",
            },
        ],
        pastOrders: [
            {
                _id: false,
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

// Validation middleware for the restaurants array length
deliveryManSchema.pre("save", function (next) {
    if (
        this.isNew &&
        (this.restaurants.length < 1 || this.restaurants.length > 3)
    ) {
        return next(
            new Error(
                "Restaurants array must have at least 1 and at most 3 items"
            )
        );
    }
    next();
});

// Middleware to handle current location update
deliveryManSchema.pre("save", async function (next) {
    if (this.isModified("currentLocation")) {
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
