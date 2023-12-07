const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'fakedb.json');

const writeCounter = (counterValue) => {
  try {
    const currentDate = new Date().toISOString();
    const dbContent = fs.readFileSync(dbFilePath, 'utf-8');
    const dbData = JSON.parse(dbContent);

    dbData.counterHistory.unshift({ value: counterValue, date: currentDate });

    if (dbData.counterHistory.length > 10) {
      dbData.counterHistory.pop();
    }

    fs.writeFileSync(dbFilePath, JSON.stringify(dbData, null, 2));

    console.log('Counter value written to the database (fakedb.json) with date:', counterValue, currentDate);
  } catch (err) {
    console.error('Error writing counter value to the database:', err);
  }
};

const getCounterHistory = () => {
  try {
    const dbContent = fs.readFileSync(dbFilePath, 'utf-8');
    const dbData = JSON.parse(dbContent);

    const counterHistory = dbData.counterHistory;

    console.log('Counter history retrieved from the database (db.json):', counterHistory);
    return counterHistory;
  } catch (err) {
    console.error('Error retrieving counter history from the database:', err);
  }
};

const getCounter = () => {
  try {
    const dbContent = fs.readFileSync(dbFilePath, 'utf-8');
    const dbData = JSON.parse(dbContent);

    const latestEntry = dbData.counterHistory[dbData.counterHistory.length - 1];

    if (latestEntry) {
      return latestEntry.value;
    } else {
      return 0;
    }
  } catch (err) {
    console.error('Error retrieving latest counter data from the database:', err);
  }
};



module.exports = { getCounter, getCounterHistory, writeCounter };
