module.exports = verifyRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const isAuthorized = Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
        if(!isAuthorized) {
            return res.status(403).send("Access Denied for this resource");
        }
        next();
    };
};