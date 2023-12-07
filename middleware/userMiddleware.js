const jwt = require('jsonwebtoken');
const jwtSecret = require('../utils/jwtSecret');

const authenticateMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/login');
  }
};

module.exports = {
    authenticateMiddleware: authenticateMiddleware
};