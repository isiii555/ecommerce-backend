const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    return { success: true, data: decoded };
  } catch (err) {
    return { success: false, data: err.message };
  }
};

module.exports = verifyRefreshToken;
