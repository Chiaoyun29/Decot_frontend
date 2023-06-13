import React, { useState, useEffect } from 'react';

const MenteeDashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  // Load workspaces from the server here

  return (
    <div>
      {/* List of workspaces */}
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace.id}>{workspace.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MenteeDashboard;