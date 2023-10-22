import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getBoardById, updateBoard, deleteBoard } from '../services/api';
import CustomModal from '../common/CustomModal';
import icon_pencil from  "../../image/icon_pencil.svg";
import { useNavigate } from 'react-router-dom';
//import CreateBoardModal from '../dashboard/CreateBoardModal';
import Canvas from '../canvas/Canvas'
import Chat from '../chat/Chat';

const MentorBoardContent = () => {
  const { boardId, workspaceId } = useParams();
  const [board, setBoard] = useState(null);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { token } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editeddtTag, setEditeddtTag] = useState('');
  const [editedDeadline, setEditedDeadline] = useState('');
  //const [boards, setBoards] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const navigate = useNavigate();

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

  if (!board) return (<div className="flex items-center justify-center min-h-screen">
  <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
</div>);

  const handleUpdateBoard = async () => {
    const response = await updateBoard(token, boardId, {
      boardTitle: editedBoardTitle,
      description: editedDescription,
      dtTag: editeddtTag,
      deadline: editedDeadline
    });
    if (response.status === 200) {
      setBoard(response.board);
      setIsEditing(false);
    } else {
      console.error(response.error);
    }
  };
  
  const handleDeleteBoard = async (workspaceId) => {
    const response = await deleteBoard(token, boardId, workspaceId);
    if (response.status === 200) {
      // You may want to redirect to dashboard or somewhere else
      console.log("Board deleted successfully.");
      navigate(`/workspace/{workspaceId}`);
    } else {
      console.error(response.error);
    }
  };

  // const handleBoardClick = ()=>{
  //   setShowCanvas(true);
  // }
  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Sidebar for managing board */}
    <div className="flex flex-grow overflow-hidden">
    <div className="w-1/4 h-full bg-white shadow-lg p-4 overflow-y-auto">
      {isEditing ? (
        <div>
          <input
            value={editedBoardTitle}
            onChange={(e) => setEditedBoardTitle(e.target.value)}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            placeholder="Board Name"
          />
          <input
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            placeholder="Board Description"
          />
          <input
            value={editeddtTag}
            onChange={(e) => setEditeddtTag(e.target.value)}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            placeholder="Board Design Thinking Tag"
          />
          <input
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            placeholder="Board Deadline"
          />
          <div className="flex justify-end">
            <button
              onClick={handleUpdateBoard}
              className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Cancel
            </button>
        </div>
      </div>
    ) : (
      <div className="p-4 my-2 text-gray-500 bg-gray-200 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="uppercase mb-2 text-3xl font-bold">{board.boardTitle}</h3>
          <button
            onClick={() => {
              setIsEditing(true);
              setEditedBoardTitle(board.boardTitle);
              setEditedDescription(board.description);
              setEditeddtTag(board.dtTag);
              setEditedDeadline(board.deadline);
            }}
            className="text-xl text-blue-500"
          >
            <img src={icon_pencil} alt="edit icon" className="w-4 h-4" />
        </button>
      </div>
      <p className="mb-2 text-sm text-gray-600">{board.description}</p>
      <p className="mb-2 text-sm text-gray-600">{board.dtTag}</p>
      <p className="mb-2 text-sm text-gray-600">{board.deadline}</p>
    </div>
  )}

        {/* Delete Board button at the bottom */}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-red-500 hover:bg-purple-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          Delete Board
        </button>

        {/* The Modal for Delete Board Confirmation */}
        <CustomModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Board"
          message="Are you sure you want to delete this board?"
        >
          <div className="flex items-center">
            <button
              onClick={handleDeleteBoard}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </CustomModal>
      </div>

      {/* Main content container */}
      <div className="w-3/4">
        <Chat />
        {/* Add content such as boards here */}  
        <div>
          <div>
            <h1 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fondWeight: 'bold'
              }}
            >
              Choose your template
            </h1>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MentorBoardContent;