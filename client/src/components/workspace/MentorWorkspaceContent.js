import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getWorkspaceById } from '../services/api';

const MentorWorkspaceContent = () => {
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
    <div className="p-6 flex">
      {/* Sidebar for managing workspace */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h3 className="text-lg font-semibold mb-2">Manage Workspace</h3>
        <p className="mb-4 text-sm">Join Code: {workspace.joinToken}</p>
        {/* Add management buttons/options here */}
        {/* For example, options to edit workspace name, description, manage mentees, delete workspace etc. */}
      </div>

      {/* Main content container */}
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-semibold mb-4">{workspace.name}</h2>
        <p className="text-gray-600 mb-4">{workspace.description}</p>
        {/* Add content such as boards here */}
      </div>
    </div>
  );
};

export default MentorWorkspaceContent;