const increaseCounter = (counter) => {
  var newValue = counter + 1;
  console.log('Counter value incremented:', newValue);
  return newValue;
};

const decreaseCounter = (counter) => {
  var newValue = counter - 1;
  console.log('Counter value decremented:', newValue);
  return newValue;
};

module.exports = {
    increaseCounter: increaseCounter,
    decreaseCounter: decreaseCounter
}