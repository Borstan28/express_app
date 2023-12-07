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

function checkUserPermissions(permission) {
  return (req, res, next) => {
    if (req.user.permissions.includes(permission)) {
      next();
    } else {
      res.status(401).send('Unauthorized - Insufficient Permissions');
    }
  };
}

module.exports = {
  checkUserPermissions: checkUserPermissions,
  authenticateMiddleware: authenticateMiddleware
};