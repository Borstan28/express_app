const usersData = require('../utils/usersData');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../utils/jwtSecret');

function loginUser(req, res) {
  const { username, password } = req.body;
  const user = usersData.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: true, errorMessage: 'Invalid Credentials' });
  }
  const token = jwt.sign({ user: { id: user.id, username: user.username, permissions: user.permissions } }, jwtSecret, { expiresIn: '1h' });
  res.cookie('token', token);
  res.redirect('/');
}

module.exports = loginUser;