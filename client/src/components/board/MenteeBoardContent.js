import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getBoardById, getCanvases, getBoardMembers } from '../services/api';

const MenteeBoardContent = () => {
  const { boardId, workspaceId } = useParams();
  const [board, setBoard] = useState(null);
  const { token } = useAuthContext();
  //const [boards, setBoards] = useState([]);
  const [canvases, setCanvases] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  //const [selectedMember, setSelectedMember] = useState(null);
  const [showDesignThinkingMessage, setShowDesignThinkingMessage] = useState(true);

  const fetchCanvases = async () => {
    const response = await getCanvases(token, boardId, workspaceId);
    console.log(response);
    if (response.status === 200) {
      setCanvases(response.canvases);
    } else {
      console.error(response.error);
    }
  };

  const fetchBoardMembers = async() =>{
    const response = await getBoardMembers(token, boardId, workspaceId);
    if (response.status === 200) {
      setBoardMembers(response.members);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    fetchCanvases();
  }, [boardId, workspaceId, token]);

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

  useEffect(() => {
    fetchBoardMembers();
  }, [boardId, workspaceId, token]);

  if (!board) return (<div className="flex items-center justify-center min-h-screen">
    <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
  </div>);

  const getDesignThinkingTip = (dtTag) =>{
    console.log("Received dtTag in getDesignThinkingMessage:", dtTag);
    switch(dtTag){
      case 'Stage 1 (Empathize)':
        return 'Research Your Needs';
      case 'Stage 2 (Define)':
        return 'State the Needs and Problems';
      case 'Stage 3 (Ideate)':
        return 'Challenge Assumptions and Create Ideas';
      case 'Stage 4 (Prototype)':
        return 'Start to Create Solutions';
      case 'Stage 5 (Test)':
        return 'Try Your Solutions Out';
      default: 
        return '';
    }
  };

  const handleCloseMessage = () => {
    setShowDesignThinkingMessage(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Fixed Sidebar for managing workspace */}
      <div className="flex flex-grow overflow-hidden">
      <div className="w-1/4 h-full bg-white shadow-lg p-4 overflow-y-auto">
        <div className="p-4 my-2 text-gray-500 bg-gray-200 rounded-md">
          <h2 className="text-2xl font-semibold mb-4 uppercase">{board.boardTitle}</h2>
          <p className="text-gray-600 mb-4">{board.description}</p>
          <p className="text-gray-600 mb-4">{board.dtTag}</p>
          <p className="text-gray-600 mb-4">{board.status}</p>
          <p className="text-gray-600 mb-4">{new Date(board.deadline).toLocaleString()}</p>
        </div>
      </div>

      {/* Main content container */}
      {/* Your main content */}
      <div className="w-3/4 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="p-4 bg-white rounded shadow-md">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {canvases.map((canvas) => (
              <li key={canvas.id} className="p-15 border rounded-md">
                <Link to={`canvas/${canvas.id}`} className="block" //need to do modi for linkage
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <div className="text-center font-medium">{canvas.canvasName}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
        {/* Section */}
        {/* <div className="p-4 bg-white rounded shadow-md">
          {/* ... content for section 2 ... */}
      </div>
      {/* Message container positioned at the bottom right corner */}
      {showDesignThinkingMessage && board && (
        <div className="absolute bottom-20 right-10 p-4 my-2 bg-white shadow rounded rounded-lg">
          <p className="text-lg text-blue-500 font-bold">
            {getDesignThinkingTip(board.dtTag)}
          </p>
          <button onClick={handleCloseMessage} className="absolute top-0 right-0 p-2 text-lg font-bold text-gray-600">
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default MenteeBoardContent;