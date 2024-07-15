const jwt = require("jsonwebtoken");
require("dotenv").config()

const generateRefreshToken = (user) => {
    const token = jwt.sign(
        {
            id : user.id,
            username : user.username,
            email : user.email,
            role : user.role
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn : "15m"
        }
    );
    return token;
};

module.exports = generateRefreshToken;