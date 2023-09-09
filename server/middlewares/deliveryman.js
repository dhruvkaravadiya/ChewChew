function admin(req, res, next) {
    // This middleware will be executed after the auth middleware
    if (req.user.role !== "DeliveryMan") {
        return res.status(403).send("Access denied. Only Delivery Man allowed.");
    }
    next();
}
module.exports = admin;
