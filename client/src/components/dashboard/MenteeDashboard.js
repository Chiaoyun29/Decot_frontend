import React, { useState, useEffect } from 'react';
import { getWorkspaces } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import JoinWorkspace from './JoinWorkspace';

const MenteeDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const { token } = useAuthContext();
  
  const fetchWorkspaces = async () => {
    const response = await getWorkspaces(token);
    if (response.status === 200) {
      setWorkspaces(response.workspaces);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);
  
  // Load workspaces from the server here
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search workspace..."
          className="flex-grow p-2 mr-4 border border-gray-300 rounded-md"
        />
        <JoinWorkspace/>
      </div>
      {/* List of workspaces */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <li key={workspace.id} className="p-6 border rounded-md">
            <Link to={`/workspace/${workspace.id}`} className="block">
              <div className="text-lg font-medium">{workspace.name}</div>
              <div className="text-gray-600">{workspace.description}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenteeDashboard;