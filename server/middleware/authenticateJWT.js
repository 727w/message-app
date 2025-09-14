const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const authHeader = req.cookies.token;
  if (!authHeader) return res.sendStatus(401);

  jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authenticateJWT;
