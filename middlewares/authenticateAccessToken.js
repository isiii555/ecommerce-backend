const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      req.body.user = decoded;
      console.log(decoded.id);
      next();
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
    return;
  }
  return res.sendStatus(401);
};

module.exports = authenticateAccessToken;
