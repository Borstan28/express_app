async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      window.location.href = '/';
    } else {
      const errorData = await response.json();
      showAlert(errorData.errorMessage);
    }
  } catch (error) {
    console.error('Error during login:', error);
    showAlert('An unexpected error occurred. Please try again.');
  }
}

function showAlert(message) {
  const alertElement = document.getElementById('alertMessage');
  alertElement.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}