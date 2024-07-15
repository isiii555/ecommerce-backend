const jwt = require("jsonwebtoken");
require("dotenv").config()

const generateAccessToken = (user) => {
    const token = jwt.sign(
        {
            id : user.id,
            username : user.username,
            email : user.email,
            role : user.role
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn : "5m"
        }
    );
    return token;
};

module.exports = generateAccessToken;