import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { joinBoard } from '../services/api';

const JoinBoard = ({ onBoardJoined }) => {
  const { token } = useAuthContext();
  
  const handleJoin = async () => {
    const response = await joinBoard(token);
    if (response.message) {
      if (onBoardJoined) onBoardJoined();
    } else {
      console.error(response.error);
    }
  };
  
  return (
    <div>
      <button onClick={handleJoin}>Join Board</button>
    </div>
  );
};

export default JoinBoard;