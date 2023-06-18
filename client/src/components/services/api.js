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

export const updateWorkspace = async (token, workspaceId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to update workspace:', error);
    return { error: 'Failed to update workspace', status: 0 };
  }
};

export const deleteWorkspace = async (token, workspaceId) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to delete workspace:', error);
    return { error: 'Failed to delete workspace', status: 0 };
  }
};

export const getWorkspaceMembers = async (token, workspaceId) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}/members`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.headers.get('content-type')?.includes('application/json') && response.ok) {
      return response.json();
    } else {
      console.error('Unexpected response:', await response.text());
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeWorkspaceMember = async (token, workspaceId, userId) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}/members/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};

export const getNotifications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notification`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
    } catch (error) {
    console.error(error);
  }
};

export const removeAllNotifications = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notification`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};

export const markAllNotificationsAsRead = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notification/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};

export const markNotificationAsRead = async (token, notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notification/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};

export const deleteNotification = async (token, notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notification/${notificationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};

export const leaveWorkspace = async (token, workspaceId) => {
  try {
    const response = await fetch(`${API_URL}/workspace/${workspaceId}/leave`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
};
export const createBoard = async (token, boardTitle, dtTag, deadline, description) => {
  try {
    const response = await fetch(`${API_URL}/board/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ boardTitle, dtTag, deadline, description}),
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to create board:', error);
    return { error: 'Failed to create board', status: 0 };
  }
};

export const getBoards = async (token) => {
  try {
    const response = await fetch(`${API_URL}/board`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(response)
    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to retrieve board:', error);
    return { error: 'Failed to retrieve board', status: 0 };
  }
};

export const getBoardById = async (token, boardId) => {
  try {
    const response = await fetch(`${API_URL}/board/${boardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to retrieve board:', error);
    return { error: 'Failed to retrieve board', status: 0 };
  }
};

export const joinBoard = async (token) => {
  try {
    const response = await fetch(`${API_URL}/board/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    console.log("Wthell")
    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to join board:', error);
    return { error: 'Failed to join board', status: 0 };
  }
};

export const updateBoard = async (token, boardId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/board/${boardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to update board:', error);
    return { error: 'Failed to update board', status: 0 };
  }
};

export const deleteBoard = async (token, boardId) => {
  try {
    const response = await fetch(`${API_URL}/board/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to delete board:', error);
    return { error: 'Failed to delete board', status: 0 };
  }
};

// export const uploadImage = async (token, boardId, userId) => {
//   try {
//     const response = await fetch(`${API_URL}/board/${boardId}/diagram/${boardId}`, {
//       method: 'ADD',
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message || 'Network response was not ok');
//     }
//     return { status: response.status, data };
//   } catch (error) {
//     console.error(error);
//   }
// };
export const createMessage = async (token, message, userId, timestamp) => {
  try {
    const response = await fetch(`${API_URL}/message/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message:message, userId:userId, timestamp:timestamp }),
    });

    const data = await response.json();
    return { data:data, status: response.status };

  } catch (error) {
    console.error('Fail to create message:', error);
    return { error: 'Fail to create message', status: 0 };
  }
};
export const getAllMessages = async (token) => {
  try {
    const response = await fetch(`${API_URL}/message/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { ...data, status: response.status };

  } catch (error) {
    console.error('Failed to load messages:', error);
    return { error: 'Failed to load messages', status: 0 };
  }
};
export const deleteMessage = async (token, messageId) => {
  try {
    const response = await fetch(`${API_URL}/message/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return { ...data, status: response.status };
  } catch (error) {
    console.error('Failed to delete message:', error);
    return { error: 'Failed to delete message', status: 0 };
  }
};