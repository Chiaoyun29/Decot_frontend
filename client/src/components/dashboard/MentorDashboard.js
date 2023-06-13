import React, { useState, useEffect } from 'react';
import CreateWorkspaceModal from './CreateWorkspaceModal';

const MentorDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  // Load workspaces from the server here
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search workspace..."
          className="flex-grow p-2 mr-4 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => setModalIsOpen(true)}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Create Workspace
        </button>
      </div>
      {/* List of workspaces */}
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace.id} className="p-2 border-b border-gray-200">{workspace.name}</li>
        ))}
      </ul>
      {/* Create Workspace Modal */}
      <CreateWorkspaceModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </div>
  );
};

export default MentorDashboard;