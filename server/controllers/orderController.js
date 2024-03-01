const Order = require("../models/Order");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryMan = require("../models/DeliveryMan");
const Customer = require("../models/Customer");
const { getCoordinates } = require("../helpers/utils/getCoordinates");
const { calculateDistance } = require("../helpers/utils/calculateDistance");
const { sendEmailToGmail } = require("../helpers/mailer/mailer");
const fs = require("fs");
const path = require("path");
const {
    STRIPE_TEST_SECRET_KEY,
    PAYMENT_SUCCESS_URL,
    PAYMENT_FAIL_URL,
} = require("../config/appConfig");
const stripe = require("stripe")(STRIPE_TEST_SECRET_KEY);
const { io } = require("../startup/io");

// PLACE NEW ORDER
async function createOrder(req, res) {
    try {
        const { items } = req.body;
        let orderTotal = 0;

        items.forEach((item) => {
            orderTotal += item.quantity * item.price;
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: line_items,
            mode: "payment",
            success_url: `${PAYMENT_SUCCESS_URL}?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: PAYMENT_FAIL_URL,
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });
        res.status(201).json({
            success: true,
            data: {
                paymentSessionId: stripeSession.id,
                paymentUrl: stripeSession.url,
            },
            message: "Payment session created successfully",
        });
    } catch (error) {
        console.error("Error creating payment session:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

// UPDATE ORDER STATUS
async function updateOrderStatus(req, res) {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant Not Found" });
    }
    const { orderStatus } = req.body;
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return res
            .status(400)
            .json({ success: false, error: "Order Not Found" });
    }
    if (order.orderStatus != "Placed" && order.orderStatus != "Preparing") {
        return res.status(400).json({
            success: false,
            error: "Sorry 🙏🙏 after Prepared you can't change the order Status",
        });
    }
    const allowedOrderStatuses = ["Prepared", "Preparing"];
    const isValidOrderStatus = allowedOrderStatuses.includes(orderStatus);
    if (!isValidOrderStatus) {
        return res.status(400).json({
            success: false,
            error: "Invalid Order Status Value",
        });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: { orderStatus } },
        { new: true }
    );

    if (!updatedOrder) {
        return res
            .status(404)
            .json({ success: false, error: "Order Not Found" });
    }

    await io.emit("updateOrderStatus", { orderId, orderStatus });

    if (updatedOrder.orderStatus === "Prepared") {
        const restaurant = await Restaurant.findById(order.restaurant.id);
        if (!restaurant) {
            return res
                .status(404)
                .json({ success: false, error: "Restaurant Not Found" });
        }

        restaurant.deliveryMen.forEach((deliveryman) => {
            const userId = deliveryman.user_id;
            io.emit("orderPrepared", {
                order: updatedOrder,
                userId: userId,
            });
        });
    }

    res.status(221).json({
        success: true,
        message: "Order Status Updated",
        orderstatus: updatedOrder.orderStatus,
    });
}

// PICK THE ORDER
const pickOrder = async (req, res) => {
    const user = req.user;
    const id = req.params.id;

    // Find the order
    const order = await Order.findById(id);

    // Check if the order exists
    if (!order) {
        return res
            .status(404)
            .json({ success: false, error: "Order not found" });
    }

    // Check if the order status is not "Prepared"
    if (order.orderStatus !== "Prepared") {
        return res
            .status(400)
            .json({ success: false, error: "Order is not prepared" });
    }

    // Find the delivery man
    const deliveryMan = await DeliveryMan.findOne({ user_id: user.id });
    if (!deliveryMan) {
        return res
            .status(404)
            .json({ success: false, error: "Delivery Man not found" });
    }

    // Check if the order status is "Prepared"
    if (order.orderStatus === "Prepared") {
        // Update the delivery man's currentOrders and the order's status
        await DeliveryMan.updateOne(
            { _id: deliveryMan.id },
            {
                $push: {
                    currentOrders: order._id,
                },
            }
        );
        // Generate OTP
        const OTP = await order.generateOTP();
        order.deliveryManId = deliveryMan._id;
        // Save the order
        await order.save();

        // Load HTML template for email
        const htmlFilePath = path.join(
            __dirname,
            "../helpers/mailer/OTP_Code.html"
        );
        const otpTemplate = fs.readFileSync(htmlFilePath, "utf-8");

        // Find the customer for email
        const customer = await Customer.findById(order.customer.id);
        if (!customer) {
            return res
                .status(404)
                .json({ success: false, error: "Customer not found" });
        }

        // Find the user for email
        const user = await User.findById(customer.user_id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        // Send email to the customer
        await sendEmailToGmail({
            email: user.email,
            subject: "OTP for Delivery Verification",
            html: otpTemplate.replace("{{otp}}", OTP),
        });

        // Update order status
        await Order.updateOne(
            { _id: order._id },
            { $set: { orderStatus: "Picked" } }
        );

        // Emit order status update
        await io.emit("orderStatusUpdate", "Picked");
    } else {
        return res.status(400).json({
            success: false,
            error: "Order is not prepared for picking",
        });
    }

    res.status(201).json({ success: true, message: "Order Picked" });
};

// COMPLETE / VERIFY THE ORDER
const completeOrder = async (req, res) => {
    const orderId = req.params.id;
    const OTP = req.body.OTP;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    // Verify OTP
    const isOTPVerified = await order.verifyOTP(OTP);

    if (!isOTPVerified) {
        throw new Error("Invalid OTP");
    }

    // Update order status to "Completed"
    order.orderStatus = "Completed";
    order.OTP = undefined;
    order.OTPExpiry = undefined;
    await order.save();

    // Move order from current orders to past orders for customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
        order.customer.id,
        {
            $pull: { currentOrders: order._id },
            $push: { pastOrders: order._id },
        }
    );
    if (!updatedCustomer) {
        throw new Error("Customer not updated");
    }

    // Move order from current orders to past orders for restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        order.restaurant.id,
        {
            $pull: { currentOrders: order._id },
            $push: { pastOrders: order._id },
            $inc: { income: order.orderTotal - order.orderTotal / 10 },
        }
    );
    if (!updatedRestaurant) {
        throw new Error("Restaurant not updated");
    }

    // Move order from current orders to delivery history for delivery man
    const updatedDeliveryMan = await DeliveryMan.findByIdAndUpdate(
        order.deliveryManId,
        {
            $pull: { currentOrders: orderId },
            $push: { pastOrders: orderId },
        }
    );
    if (!updatedDeliveryMan) {
        throw new Error("Delivery Man not updated");
    }
    await io.emit("orderStatusUpdate", "Completed");

    // Return success response
    return res
        .status(200)
        .json({ success: true, message: "Order completed successfully" });
};

// CANCEL THE ORDER
const cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return res
            .status(404)
            .json({ success: false, error: "Order not found" });
    }
    if (order.orderStatus !== "Placed") {
        return res.status(400).json({
            success: false,
            error: "Order cannot be canceled",
        });
    }
    const deliveryMan = await DeliveryMan.findByIdAndUpdate(
        order.deliveryMan.id,
        {
            $push: { cancelledOrders: order._id },
            $pull: { currentOrders: order._id },
        }
    );
    if (!deliveryMan) {
        return res.status(404).json({
            success: false,
            error: "No delivery man has picked your order",
        });
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        order.restaurant.id,
        {
            $push: { cancelledOrders: order._id },
            $pull: { currentOrders: order._id },
        }
    );
    if (!updatedRestaurant) {
        return res
            .status(404)
            .json({ success: false, error: "Restaurant not found" });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        order.customer.id,
        {
            $pull: { currentOrders: order._id },
        }
    );
    if (!updatedCustomer) {
        return res
            .status(404)
            .json({ success: false, error: "Customer not found" });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        return res
            .status(404)
            .json({ success: false, error: "Order not deleted" });
    }

    // Commit the transaction here after successful deletion
    await session.commitTransaction();
    //emit on delete order
    await io.emit("orderStatusUpdate", "Canceled");
    // Return success response after successful deletion
    return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
};

// GET ROLE WISE PAST ORDERS
const getPastOrders = async (req, res) => {
    const role = req.user.role;
    const userId = req.user._id;

    try {
        let model, fieldName;

        switch (role) {
            case "Restaurant":
                model = Restaurant;
                fieldName = "user_id";
                break;
            case "DeliveryMan":
                model = DeliveryMan;
                fieldName = "user_id";
                break;
            case "Customer":
                model = Customer;
                fieldName = "user_id";
                break;
            default:
                return res
                    .status(400)
                    .json({ success: false, error: "Invalid Role" });
        }

        const userInstance = await model.findOne({ [fieldName]: userId });
        if (!userInstance) {
            return res
                .status(404)
                .json({ success: false, error: `${role} Not Found ` });
        }

        const pastOrders = userInstance.pastOrders;

        // Check if there are past orders before querying the Order model
        if (!pastOrders || pastOrders.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const orders = await Order.find({ _id: { $in: pastOrders } });

        return res.status(200).json({
            success: true,
            message: "Past Orders fetched Successfully",
            data: orders,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
};

// GET ROLE WISE CURRENT ORDERS
const getCurrentOrders = async (req, res) => {
    const role = req.user.role;
    const userId = req.user._id;
    try {
        let model;
        switch (role) {
            case "Restaurant":
                model = Restaurant;
                break;
            case "DeliveryMan":
                model = DeliveryMan;
                break;
            case "Customer":
                model = Customer;
                break;
            default:
                return res
                    .status(400)
                    .json({ success: false, error: "Invalid Role" });
        }

        const userInstance = await model.findOne({ user_id: userId });

        if (!userInstance) {
            return res
                .status(404)
                .json({ success: false, error: `${role} Not Found ` });
        }

        const currentOrders = await Order.find({
            _id: { $in: userInstance.currentOrders },
        });

        return res.status(200).json({
            success: true,
            message: "Current Orders fetched Successfully",
            data: currentOrders,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
};

const getPreparedOrders = async (req, res) => {
    try {
        const preparedOrders = await Order.find({ orderStatus: "Prepared" });
        return res.status(200).json({
            success: true,
            message: "Prepared Orders fetched Successfully",
            data: preparedOrders,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
};

const getOrderDistance = async (req, res) => {
    const orderLocation = req.body.orderLocation;
    const customerLocation = req.body.customerLocation;
    const kms = calculateDistance(
        orderLocation.latitude,
        orderLocation.longitude,
        customerLocation.latitude,
        customerLocation.longitude
    );
    console.log(kms);
    return res.status(200).json({ success: true, data: kms });
};

// Handle successful payment and create database order
async function handleSuccessfulPayment(req, res) {
    try {
        const customer = await Customer.findOne({ user_id: req.user.id });

        if (!customer) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res
                .status(404)
                .json({ success: false, message: "Restaurant not found!" });
        }

        const coordinates = await getCoordinates();

        const sessionId = req.query.sessionId;
        // Retrieve relevant information from the session or request
        const { items } = req.body;
        let orderTotal = 0;
        items.forEach((item) => {
            orderTotal += item.quantity * item.price;
        });
        // Fetch information related to the Stripe session
        const stripeSession = await stripe.checkout.sessions.retrieve(
            sessionId
        );
        // Check if payment was successful in the Stripe session
        if (stripeSession.payment_status === "paid") {
            // Continue with creating the database order
            const restaurantId = req.params.id;
            const restaurant = await Restaurant.findById(restaurantId);

            const order = new Order({
                customer: {
                    id: customer._id,
                    name: req.user.name,
                },
                restaurant: {
                    id: restaurant._id,
                    name: restaurant.restaurantName,
                },
                deliveryLocation: {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                },
                restaurantLocation: {
                    latitude: restaurant.location.latitude,
                    longitude: restaurant.location.longitude,
                },
                items,
                orderTotal,
                paymentStatus: "Paid",
                placedAt: new Date(),
            });

            // Save the order to the database
            const savedOrder = await order.save();

            // Update restaurant and customer with the new order
            await Restaurant.findByIdAndUpdate(restaurantId, {
                $push: { currentOrders: savedOrder._id },
            });

            await Customer.findByIdAndUpdate(customer._id, {
                $push: { currentOrders: savedOrder._id },
            });

            // Emit orderPlaced
            await io.emit("orderPlaced", {
                userId: restaurant.user_id,
                newOrder: savedOrder,
            });

            res.status(201).json({
                success: true,
                data: {
                    order: savedOrder,
                },
                message: "Order Placed Successfully",
            });
        } else {
            // If payment was not successful, handle accordingly
            return res.status(400).json({
                success: false,
                error: "Payment was not successful",
            });
        }
    } catch (error) {
        console.error("Error handling successful payment:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function getPreparedOrderByDeliverymanId(req, res) {
    const deliverymanId = req.params.id;
    //   const deliverymanId = req.user._id;

    try {
        const deliveryman = await DeliveryMan.findOne({
            user_id: deliverymanId,
        });
        if (!deliveryman) {
            return res.status(404).json({ message: "Deliveryman not found" });
        }
        let prepredOrders = [];

        // Iterate through each restaurant ID in the deliveryman's restaurant array
        for (const restaurantObj of deliveryman.restaurants) {
            const restaurantId = restaurantObj.id;
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                console.log(`Restaurant with ID ${restaurantId} not found`);
                continue;
            }

            const orderIds = restaurant.currentOrders;
            const orders = await Order.find({
                _id: { $in: orderIds },
                orderStatus: "Prepared",
            });
            prepredOrders = prepredOrders.concat(orders);
        }

        res.status(200).json({
            succcess: true,
            message:
                "prepredOrders of delivery man fetched Fetched successfully",
            data: prepredOrders,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    createOrder,
    updateOrderStatus,
    pickOrder,
    cancelOrder,
    completeOrder,
    getPastOrders,
    getCurrentOrders,
    getPreparedOrders,
    getOrderDistance,
    handleSuccessfulPayment,
    getPreparedOrderByDeliverymanId,
};
