import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getWorkspaceById } from '../services/api';

const MenteeWorkspaceContent = () => {
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const { token } = useAuthContext();

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