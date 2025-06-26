require('dotenv').config();

module.exports = {
    jwt_passcode: process.env.JWT_SECRET || "superSecret123#@!"
};
