const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    //first get the token from the request header's cookies and check if available
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).send("You are not Authenticated");
    }
    //now verify token with the jwt private key
    jwt.verify(token, process.env.JWT_SECRET_KET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
}

module.exports = verifyToken;