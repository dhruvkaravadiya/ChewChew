const mongoose = require("mongoose");

// Custom validator function for time format
const validateTime = (time) => {
    // Regular expression to validate HH:MM format
    const timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

const restaurantSchema = mongoose.Schema(
    {
        restaurantName: {
            type: String,
            required: [true, "Please enter Restaurant Name"],
            unique: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for references
            ref: "User", // Assuming User is the model name for restaurant owners
            required: [true, "Restaurant's Owner Id is required"],
            unique: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Please enter Contact Number"],
            minlength: 10,
            unique: true,
        },
        quickDescription: {
            type: String,
            required: [true, "Please enter Quick Description"],
            maxlength: 30,
            minlength: 10,
        },
        address: {
            type: String,
            required: [true, "Please enter the address"],
        },
        detailedDescription: {
            type: String,
            required: [true, "Please enter Description"],
            maxlength: 400,
            minlength: 100,
        },
        cuisines: {
            type: [String],
            default: [],
        },
        address: {
            type: String,
            required: [true, "Please enter Address"],
        },
        location: {
            latitude: String,
            longitude: String,
        },
        photo: {
            id: {
                type: String,
            },
            photoUrl: {
                type: String,
            },
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        menu: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Food",
            },
        ],
        openingHours: {
            type: String,
            required: true,
            validate: [validateTime, "Invalid time format. Use HH:MM format."],
        },
        closingHours: {
            type: String,
            required: true,
            validate: [validateTime, "Invalid time format. Use HH:MM format."],
        },
        currentOrders: [
            {
                _id: false,
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        pastOrders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        currentOrders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        cancelledOrders: {
            type: Number,
            default: 0,
        },
        deliveryMen: [
            {
                id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "DeliveryMan",
                },
                user_id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "User",
                },
                name: {
                    type: String,
                },
            },
        ],
        deliveryCharges: {
            type: Number,
            required: [true, "Please add delivery charges"],
        },
        promotions: {
            type: String,
        },
        income: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false }
);

restaurantSchema.path("currentOrders").default([]);
restaurantSchema.path("pastOrders").default([]);

const Restaurant = mongoose.model("restaurants", restaurantSchema);

module.exports = Restaurant;
