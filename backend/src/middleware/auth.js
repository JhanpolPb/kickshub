const jwt = require("jsonwebtoken");

console.log('logging')
const authMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization;
}

app.use(logger)