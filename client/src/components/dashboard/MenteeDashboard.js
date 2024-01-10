import React, { useState, useEffect, useContext } from 'react';
import { getWorkspaces } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import JoinWorkspace from './JoinWorkspace';

const MenteeDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const { token } = useAuthContext();
  const { socket, addNotificationCallback, removeNotificationCallback } = useContext(SocketContext);
  const [searchInput, setSearchInput] = useState('');
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);

  const fetchWorkspaces = async () => {
    const response = await getWorkspaces(token);
    if (response.status === 200) {
      setWorkspaces(response.workspaces);
    } else {
      console.error(response.error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value.toLowerCase());
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const filtered = workspaces.filter(workspace =>
      workspace.name.toLowerCase().includes(searchInput) ||
      workspace.description.toLowerCase().includes(searchInput)
    );
    setFilteredWorkspaces(filtered);
  }, [workspaces, searchInput]);

  useEffect(() => {
    if (socket) {
      const callback = (message) => {
        fetchWorkspaces();
      };
      addNotificationCallback(callback);
      return () => {
        removeNotificationCallback(callback);
      };
    }
  }, [socket]);

  return (
    <div className="container pt-6 pr-10 pl-10 bg-gray-100 relative min-h-screen">
      <div className="absolute left-0 pl-10">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center py-4 pl-2">
            <svg fill="currentColor" viewBox="0 0 512 512" className="w-5 h-5 dark:text-gray-400">
              <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
            </svg>
          </span>
          <input
            type="search"
            name="Search"
            placeholder="Search Workspace..."
            className="py-2 pl-10 text-m rounded-md"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <JoinWorkspace onWorkspaceJoined={fetchWorkspaces} />
      {/* List of workspaces */}
      <div className="container pt-10">
        <ul className="pt-5 grid grid-cols-1 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <li key={workspace.id} className="pt-5 p-6 border rounded-md shadow-md bg-gray-50">
              <Link to={`/workspace/${workspace.id}`} className="block">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: workspace.color }}
                    >
                      {workspace.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium uppercase">{workspace.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <i><strong>Workspace Description: </strong><br></br>{workspace.description}</i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenteeDashboard;