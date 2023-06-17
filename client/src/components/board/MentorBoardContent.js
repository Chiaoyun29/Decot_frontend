import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getBoardById, updateBoard, deleteBoard } from '../services/api';
import CustomModal from '../common/CustomModal';
//import CreateBoardModal from '../dashboard/CreateBoardModal';
import Canvas from '../canvas/Canvas'

const MentorBoardContent = () => {
  const { boardId } = useParams();
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
  //const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);


  useEffect(() => {
    const fetchBoard = async () => {
      const response = await getBoardById(token, boardId);
      console.log("dsfsdf",response)
      if (response.board) {
        setBoard(response.board);
      } else {
        console.error(response.error);
      }
    };
    fetchBoard();
  }, [boardId, token]);

  if (!board) return <div>Loading...</div>;

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
  
  const handleDeleteBoard = async () => {
    const response = await deleteBoard(token, boardId);
    if (response.status === 200) {
      // You may want to redirect to dashboard or somewhere else
      console.log("Board deleted successfully.");
    } else {
      console.error(response.error);
    }
  };

  const handleBoardClick = ()=>{
    setShowCanvas(true);
  }
  return (
    <div className="p-6 flex">
      {/* Sidebar for managing board */}
      <div className="w-1/4 bg-gray-100 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Manage Board</h3>
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
        ) : (
          <div className="mb-4">
            <h3 className="mb-2 font-medium">{board.boardTitle}</h3>
            <p className="mb-2 text-sm text-gray-600">{board.description}</p>
            <p className="mb-2 text-sm text-gray-600">{board.dtTag}</p>
            <p className="mb-2 text-sm text-gray-600">{board.deadline}</p>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedBoardTitle(board.boardTitle);
                setEditedDescription(board.description);
                setEditeddtTag(board.dtTag);
                setEditedDeadline(board.deadline);
              }}
              className="mb-4 mr-2 px-3 py-1 bg-yellow-500 text-white rounded-md"
            >
              Edit
            </button>
          </div>
        )}

        {/* Delete Board button at the bottom */}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-auto px-3 py-1 bg-red-500 text-white rounded-md"
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
      {/* Add content such as boards here */}  
        {showCanvas ? (
          <Canvas />
        ):(
          <div>
            <div>
              <h3 className="mb-2 font-medium">{board.boardTitle}</h3>
              <p className="mb-2 text-sm text-gray-600">{board.description}</p>
              <p className="mb-2 text-sm text-gray-600">{board.dtTag}</p>
              <p className="mb-2 text-sm text-gray-600">{board.deadline}</p>
            </div>
            <button onClick={handleBoardClick}>Open Canvas</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorBoardContent;