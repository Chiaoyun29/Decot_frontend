import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getBoardById, leaveWorkspace } from '../services/api';

const MenteeBoardContent = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const { token } = useAuthContext();
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await getBoardById(token, boardId);
      if (response.board) {
        setBoard(response.board);
      } else {
        console.error(response.error);
      }
    };
    fetchBoard();
  }, [boardId, token]);

  if (!board) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards&&boards.map((board) => (
            <li key={boards.id} className="p-6 border rounded-md">
              <Link to={`/board/${board.id}`} className="block">
                <div className="text-lg font-medium">{board.boardTitle}</div>
                <div className="text-gray-600">{board.description}</div>
                <div className="text-gray-600">{board.dtTag}</div>
                <div className="text-gray-600">{board.deadline}</div>
              </Link>
            </li>
          ))}
        </ul>
      {/* Add content such as boards here (view only) */}
    </div>
  );
};

export default MenteeBoardContent;