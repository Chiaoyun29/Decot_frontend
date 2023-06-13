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

    if (!response.ok) {
      return { error: data.errors.map(err => err.msg).join(", ") };
    }
    return data;
  } catch (error) {
    throw new Error('Failed to register user');
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

    if (!response.ok) {
      return { error: data.errors.map(err => err.msg).join(", ") };
    }
    return data;
  } catch (error) {
    throw new Error('Failed to login');
  }
};