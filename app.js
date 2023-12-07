const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { incrementCounterHandler, decrementCounterHandler, getCounterValueHandler, getCounterHistoryHandler, writeCounterInterval } = require('./handlers/counter');
const loginUser = require('./handlers/login');
const { authenticateMiddleware, checkUserPermissions} = require('./middleware/userMiddleware');

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

app.post('/login', loginUser);

app.get('/counter/increment', authenticateMiddleware, checkUserPermissions('counter:incr'), incrementCounterHandler);

app.get('/counter/decrement', authenticateMiddleware, checkUserPermissions('counter:decr'), decrementCounterHandler);

app.get('/counter', authenticateMiddleware, checkUserPermissions('counter:read'), getCounterValueHandler);

app.get('/counter/history', authenticateMiddleware, checkUserPermissions('counter:read'), getCounterHistoryHandler);

setInterval(writeCounterInterval, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
