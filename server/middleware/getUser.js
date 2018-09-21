const jwt = require("jsonwebtoken");

const config = require("../../config");

function getUser(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return next();
  }

  token = token.replace("Bearer ", "");
  return jwt.verify(token, config.sessionSecret, (err, user) => {
    if (user) {
      req.user = user.id;
    }
    return next();
  });
}

module.exports = getUser;
