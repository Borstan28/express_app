const counterValue = document.getElementById('counterValue');
const historyContainer = document.getElementById('historyContainer');
const isCounterDataRetrieved = document.getElementById('isCounterDataRetrieved').value;

const makeRequest = async (url, method, responseType = 'json') => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('token'),
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (responseType === 'json') {
      const result = await response.json();
      return result;
    } else if (responseType === 'html') {
      const result = await response.text();
      return result;
    } else {
      throw new Error('Invalid response type specified');
    }
  } catch (error) {
    console.error('Error making request:', error.message);
  }
};

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find((c) => c.trim().startsWith(name + '='));

  return cookie ? cookie.split('=')[1] : null;
};

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };
  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}

document.getElementById('increaseBtn').addEventListener('click', async () => {
  let result = await makeRequest('/counter/increment', 'GET');
});

document.getElementById('decreaseBtn').addEventListener('click', async () => {
  const result = await makeRequest('/counter/decrement', 'GET');
});

document.getElementById('getCounterBtn').addEventListener('click', async () => {
  const result = await makeRequest('/counter', 'GET');
  counterValue.innerHTML = result.counterValue;
});

document.getElementById('getHistoryBtn').addEventListener('click', async () => {
  const result = await makeRequest('/counter/history', 'GET', 'html');
  historyContainer.innerHTML = result;
});

document.getElementById('logOutBtn').addEventListener('click', async () => {
  deleteCookie('token');
  location.reload();
})