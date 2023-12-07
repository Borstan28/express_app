
const { increaseCounter, decreaseCounter } = require('../controllers/counter');
const { writeCounter, getCounterHistory} = require('../db');
let counterValue = 0;

function incrementCounterHandler(req, res) {
  const newValue = increaseCounter(counterValue);
  counterValue = newValue;
  res.status(200).json({ success: true, message: 'Counter increased' });
}

function decrementCounterHandler(req, res) {
  const newValue = decreaseCounter(counterValue);
  counterValue = newValue;
  res.status(200).json({ success: true, message: 'Counter decreased' });
}

function getCounterValueHandler(req, res) {
  res.status(200).json({ success: true, message: 'Counter value retrieved', counterValue });
}

function getCounterHistoryHandler(req, res) {
  const counterHistory = getCounterHistory();
  res.render('historyList', { history: counterHistory });
}

function writeCounterInterval() {
  if (counterValue !== 0) {
    writeCounter(counterValue);
    counterValue = 0;
  }
}

module.exports = {
    incrementCounterHandler, decrementCounterHandler, getCounterValueHandler, getCounterHistoryHandler, writeCounterInterval
}