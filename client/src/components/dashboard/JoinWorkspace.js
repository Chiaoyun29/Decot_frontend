import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { joinWorkspace } from '../services/api';

const JoinWorkspace = ({ onWorkspaceJoined }) => {
  const [joinToken, setJoinToken] = useState('');
  const { token } = useAuthContext();
  
  const handleJoin = async () => {
    const response = await joinWorkspace(token, joinToken);
    if (response.message) {
      if (onWorkspaceJoined) onWorkspaceJoined();
    } else {
      console.error(response.error);
    }
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Join Token"
        value={joinToken}
        onChange={(e) => setJoinToken(e.target.value)}
      />
      <button onClick={handleJoin}>Join Workspace</button>
    </div>
  );
};

export default JoinWorkspace;