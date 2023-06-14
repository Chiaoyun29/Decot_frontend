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

export const createWorkspace = async (token, name, description) => {
  try {
    const response = await fetch(`${API_URL}/workspace/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to create workspace:', error);
    return { error: 'Failed to create workspace', status: 0 };
  }
};

export const getWorkspaces = async (token) => {
  try {
    const response = await fetch(`${API_URL}/workspace`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to retrieve workspaces:', error);
    return { error: 'Failed to retrieve workspaces', status: 0 };
  }
};

export const getWorkspaceById = async (token, workspaceId) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to retrieve workspace:', error);
    return { error: 'Failed to retrieve workspace', status: 0 };
  }
};

export const joinWorkspace = async (token, joinToken) => {
  try {
    const response = await fetch(`${API_URL}/workspace/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ token: joinToken }),
    });
    console.log("Wthell")
    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to join workspace:', error);
    return { error: 'Failed to join workspace', status: 0 };
  }
};