const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { jwt_passcode } = require("./config");
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");

const app = express();
app.use(bodyParser.json());

// Password hashing function
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Password verification function
async function verifyPassword(inputPassword, storedHash) {
    return await bcrypt.compare(inputPassword, storedHash);
}

// JWT token generation function
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, jwt_passcode, { expiresIn: "1h" });
}

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Token missing." });

    jwt.verify(token, jwt_passcode, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalid." });
        req.user = user;
        next();
    });
}

// export helper functions if needed elsewhere
module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    authenticateToken
};

app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT= 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
