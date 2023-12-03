import React, { useState, useContext } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { joinWorkspace } from '../services/api';

const JoinWorkspace = ({ onWorkspaceJoined }) => {
  const [joinToken, setJoinToken] = useState('');
  const { token } = useAuthContext();
  
  const handleJoin = async () => {
    const response = await joinWorkspace(token, joinToken);
    if (response.message) {
      if (onWorkspaceJoined) {
        onWorkspaceJoined();
      }
    } else {
      console.error(response.error);
    }
  };
  
  return (
    <div className="absolute right-0 pr-10">
      <input
        type="text"
        placeholder="Enter Join Token"
        value={joinToken}
        onChange={(e) => setJoinToken(e.target.value)}
        className="p-2 mr-4 border border-gray-300 rounded-md"
      />
      <button
        onClick={(e) => {
          handleJoin();
          e.currentTarget.blur(); // Remove focus from the button after click
        }}
        className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-yellow-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
        Join Workspace
    </button>
    </div>
  );
};

export default JoinWorkspace;