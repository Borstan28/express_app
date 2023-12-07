const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const { increaseCounter, decreaseCounter } = require('./controllers/counter');
const { writeCounter, getCounter, getCounterHistory} = require('./db');
const { authenticateMiddleware } = require('./middleware/userMiddleware');
const usersData = require('./utils/usersData');
const jwtSecret = require('./utils/jwtSecret');

let counterValue = 0;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', authenticateMiddleware, (req, res) => {
  res.render('homepage', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('loginPage');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersData.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: true, errorMessage: 'Invalid Credentials' });
  }
  const token = jwt.sign({ user: { id: user.id, username: user.username, permissions: user.permissions } }, jwtSecret, { expiresIn: '1h' });
  res.cookie('token', token);
  res.redirect('/');
});

app.get('/increment', authenticateMiddleware, (req, res) => {
  if (req.user.permissions.includes('counter:incr')) {
    const newValue = increaseCounter(counterValue);
    counterValue = newValue;
    res.status(200).json({ success: true, message: 'Counter increased' });
  } else {
    res.status(401).send('Unauthorized - Insufficient Permissions');
  }
});

app.get('/decrement', authenticateMiddleware, (req, res) => {
  if (req.user.permissions.includes('counter:decr')) {
    const newValue = decreaseCounter(counterValue);
    counterValue = newValue;
    res.status(200).json({ success: true, message: 'Counter decreased' });
  } else {
    res.status(401).send('Unauthorized - Insufficient Permissions');
  }
});

app.get('/counter', authenticateMiddleware, (req, res) => {
  if (req.user.permissions.includes('counter:read')) {
    res.status(200).json({ success: true, message: 'Counter value retrieved', counterValue });
  } else {
    res.status(401).send('Unauthorized - Insufficient Permissions');
  }
});

app.get('/counterHistory', authenticateMiddleware, (req, res) => {
  if (req.user.permissions.includes('counter:read')) {
    var counterHistory = getCounterHistory();
    res.render('historyList', {history: counterHistory});
  } else {
    res.status(401).send('Unauthorized - Insufficient Permissions');
  }
});

setInterval(() => {
  if (counterValue !== 0) {
    writeCounter(counterValue);
    counterValue = 0;
  }
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
