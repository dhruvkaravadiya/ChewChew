function admin(req, res, next) {
    // This middleware will be executed after the auth middleware
    if (req.user.role !== "Restaurant") {
        return res.status(403).send("Access denied. Only restaurant admins allowed.");
    }
    next();
}
module.exports = admin;
