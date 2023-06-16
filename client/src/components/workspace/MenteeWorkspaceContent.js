import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getWorkspaceById } from '../services/api';
import SocketContext from '../../context/SocketContext';

const MenteeWorkspaceContent = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const { token } = useAuthContext();
  const { socket, addNotificationCallback, removeNotificationCallback } = useContext(SocketContext);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await getWorkspaceById(token, workspaceId);
      if (response.workspace) {
        setWorkspace(response.workspace);
      } else {
        console.error(response.error);
      }
    };
    fetchWorkspace();
  }, [workspaceId, token]);

  useEffect(() => {
    if (socket) {
      const callback = (message) => {
      };
      addNotificationCallback(callback);
    return () => {
      removeNotificationCallback(callback);
    };
    }
  }, [socket]);

  if (!workspace) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{workspace.name}</h2>
      <p className="text-gray-600 mb-4">{workspace.description}</p>
      {/* Add content such as boards here (view only) */}
    </div>
  );
};

export default MenteeWorkspaceContent;