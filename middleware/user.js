const jwt = require("jsonwebtoken");
const { jwt_passcode } = require("../config.js");

function userMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing." });
    }

    try {
        const decodedVal = jwt.verify(token, jwt_passcode);
        if (decodedVal.username && decodedVal.role === "user") {
            req.user = decodedVal;
            next();
        } else {
            res.status(403).json({ message: "User not authenticated." });
        }
    } catch (e) {
        res.status(401).json({ message: "Invalid token." });
    }
}

module.exports = userMiddleware;