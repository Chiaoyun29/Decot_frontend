const API_URL = 'http://localhost:5000';

export const registerUser = async (username, email, password, role) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();

    // Include the status in the returned object for both success and error cases
    return { ...data, status: response.status };
    
  } catch (error) {
    console.error('Failed to register user:', error);
    // Include a status code to indicate a client-side error
    return { error: 'Failed to register user', status: 0 };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Include the status in the returned object for both success and error cases
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to login:', error);
    // Include a status code to indicate a client-side error
    return { error: 'Failed to login', status: 0 };
  }
};
