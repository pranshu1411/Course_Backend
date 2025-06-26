const jwt = require("jsonwebtoken");
const { jwt_passcode } = require("../config.js");

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not provided." });

    try {
        const decoded = jwt.verify(token, jwt_passcode);
        if (decoded.username) {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: "Admin not authenticated." });
        }
    } catch (e) {
        res.status(401).json({ message: "Invalid token." });
    }
}

module.exports = adminMiddleware;
