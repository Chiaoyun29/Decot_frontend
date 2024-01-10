import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getBoardById, updateBoard, deleteBoard, getCanvases, addWorkspaceMember, getWorkspaceMembers, getBoardMembers, deleteBoardMember, updateCanvas, deleteCanvas } from '../services/api';
import CustomModal from '../common/CustomModal';
import icon_pencil from "/image/icon_pencil.svg";
import CreateCanvasModal from '../board/CreateCanvasModal';

const MentorBoardContent = () => {
  const { boardId, workspaceId } = useParams();
  const [board, setBoard] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { token } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBoardTitle, setEditedBoardTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editeddtTag, setEditeddtTag] = useState('');
  const [editedDeadline, setEditedDeadline] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const navigate = useNavigate();
  const [canvases, setCanvases] = useState([]);
  const [isMemberAddModalOpen, setIsMemberAddModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [isAddingMembersModalOpen, setIsAddingMembersModalOpen] = useState(false);
  const [isMemberDeleteModalOpen, setIsMemberDeleteModalOpen] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [isEditingCanvasName, setIsEditingCanvasName] = useState(false);
  const [isDeletingCanvasName, setIsDeletingCanvasName] = useState(false);
  const [editedCanvasName, setEditedCanvasName] = useState('');
  const [selectedCanvasIdForEdit, setSelectedCanvasIdForEdit] = useState(null);
  const [selectedCanvasIdForDelete, setSelectedCanvasIdForDelete] = useState(null);
  const [isDeleteCanvasModalOpen, setIsDeleteCanvasModalOpen] = useState(false);
  const [showDesignThinkingMessage, setShowDesignThinkingMessage] = useState(true);
  const [memberUpdate, setMemberUpdate] = useState(0);

  const fetchCanvases = async () => {
    const response = await getCanvases(token, boardId, workspaceId);
    console.log(response);
    if (response.status === 200) {
      setCanvases(response.canvases);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    fetchCanvases();
  }, [boardId, workspaceId, token]);

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await getBoardById(token, boardId, workspaceId);
      if (response.board) {
        setBoard(response.board);
      } else {
        console.error(response.error);
      }
    };
    fetchBoard();
  }, [workspaceId, boardId, token]);

  useEffect(() => {
    if (isManageMembersModalOpen) {
      fetchWorkspaceMembers();
      fetchBoardMembers();
    }
  }, [token, workspaceId, boardId, memberUpdate, isManageMembersModalOpen]);

  const fetchWorkspaceMembers = async () => {
    try {
      const members = await getWorkspaceMembers(token, workspaceId);
      setWorkspaceMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchBoardMembers = async () => {
    try {
      const members = await getBoardMembers(token, boardId, workspaceId);
      setBoardMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  if (!board) return (<div className="flex items-center justify-center min-h-screen">
    <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
  </div>);

  const handleUpdateBoard = async () => {
    const response = await updateBoard(token, boardId, {
      boardTitle: editedBoardTitle,
      description: editedDescription,
      dtTag: editeddtTag,
      deadline: editedDeadline,
      status: editedStatus
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
      // get budao workspaceId
      navigate(-1);
    } else {
      console.error(response.error);
    }
  };

  const handleAddMember = async () => {
    try {
      if (selectedMember) {
        // Check if the selected member is already a board member
        const isBoardMember = boardMembers.some(member => member.id === selectedMember.id);
  
        if (!isBoardMember) {
          const response = await addWorkspaceMember(token, workspaceId, boardId, selectedMember.id);
          if (response && response.status === 200) {
            fetchWorkspaceMembers(); // refresh the members list
            setIsMemberAddModalOpen(false);
          } else {
            console.error(response && response.error);
          }
        } else {
          console.error('Error: User is already a board member.');
        }
      } else {
        console.error('Error: selectedMember is not defined.');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleDeleteMember = async () => {
    try {
      if (selectedMember) {
        // Check if the selected member is already a board member
        const isBoardMember = boardMembers.some(member => member.id === selectedMember.id);
  
        if (isBoardMember) {
          const response = await deleteBoardMember(token, workspaceId, boardId, selectedMember.id);
          if (response && response.status === 200) {
            fetchWorkspaceMembers(); // refresh the members list
            setIsMemberDeleteModalOpen(false);
            setMemberUpdate(prev => prev + 1);
            navigate();
          } else {
            console.error(response && response.error);
          }
        } else {
          console.error('Error: Cannot delete board member.');
        }
      } else {
        console.error('Error: selectedMember is not defined.');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleCanvasRightClick = (e, canvasId) => {
    e.preventDefault();
    setSelectedCanvasIdForEdit(canvasId);
    setSelectedCanvasIdForDelete(canvasId);
    setContextMenuVisible(true);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
  };

  // Enter edit mode
  const enterEditMode = () => {
    if (selectedCanvasIdForEdit != null) {
      const selectedCanvas = canvases.find(canvas => canvas.id === selectedCanvasIdForEdit);
      if(selectedCanvas){
        setIsEditingCanvasName(selectedCanvas.canvasName);
        setIsEditingCanvasName(true);
        setContextMenuVisible(false);
      }else{
        console.error('Canvas not found for Id: ', selectedCanvasIdForEdit);
      }
    }else{
      console.error('No canvas selected for editing.');
    }
  };

  const enterDeleteMode = () => {
    if (selectedCanvasIdForDelete != null) {
        setIsDeleteCanvasModalOpen(true);
        setContextMenuVisible(false);
    }else{
      console.error('No canvas selected for editing.');
    }
  };

  const handleEditCanvas = async (e, canvasId) => {
    console.log("Selected Canvas ID for Edit:", selectedCanvasIdForEdit);
    if(e.key ==="Enter"){
      setIsEditingCanvasName(false);
        const response = await updateCanvas(token, workspaceId, boardId, selectedCanvasIdForEdit, { //modify
        canvasName: editedCanvasName
      });
      if (response.status === 200) {
        const updatedCanvas = canvases.map(c => {
          if (c.id === canvasId) {
            return { ...c, canvasName: editedCanvasName };
          }
          return c;
        });
        setCanvases(updatedCanvas);
        setIsEditingCanvasName(false);
        setEditedCanvasName('');
        setSelectedCanvasIdForEdit(null);
      } else {
        console.error(response.error);
      }
    }
  };

  const handleDeleteCanvas = async () => {
    console.log("Selected Canvas ID for Delete:", selectedCanvasIdForDelete);
    const response = await deleteCanvas(token, workspaceId, boardId, selectedCanvasIdForDelete); //modify
    if (response.status === 200) {
      setIsDeleteCanvasModalOpen(false); // Close the modal
      setCanvases(canvases.filter(canvas => canvas.id !== selectedCanvasIdForDelete)); // Update the state
      setSelectedCanvasIdForDelete(null);
      //navigate(-1);
    } else {
      console.error(response.error);
    }
  };

  const getDesignThinkingTip = (dtTag) =>{
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
    <div className="flex flex-col h-screen bg-gray-100 relative">
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
              <select
                value={editeddtTag}
                onChange={(e) => setEditeddtTag(e.target.value)}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
              >
                <option value="" disabled>Select design thinking stage</option>
                <option value="Stage 1 (Empathize)">Empathize</option>
                <option value="Stage 2 (Define)">Define</option>
                <option value="Stage 3 (Ideate)">Ideate</option>
                <option value="Stage 4 (Prototype)">Prototype</option>
                <option value="Stage 5 (Test)">Test</option>
              </select>
              <input
                type="date" //later change to date picker (?) tried but got problem
                value={editedDeadline}
                onChange={(e) => setEditedDeadline(e.target.value)}
                className="mb-2 w-full px-3 py-2 border rounded-md"
                placeholder="Board Deadline"
              />
              <select
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
              >
                <option value="Incomplete">Incomplete</option>
                <option value="Done">Done</option>
              </select>
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
                    setEditedStatus(board.status);
                  }}
                  className="text-xl text-blue-500"
                >
                  <img src={icon_pencil} alt="edit icon" className="w-4 h-4" />
                </button>
              </div>
              <p className="mb-2 text-sm text-gray-600">{board.description}</p>
              <p className="mb-2 text-sm text-gray-600">{board.dtTag}</p>
              <p className="mb-2 text-sm text-gray-600">Status: {board.status}</p>
              <p className="mb-2 text-sm text-gray-600">{new Date(board.deadline).toLocaleString()}</p>
            </div>
          )}

        {/* Manage members */}
        <button
          onClick={() => setIsAddingMembersModalOpen(true)}
          className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-indigo-500 hover:bg-purple-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          Add Members
        </button>

        {/* View Members list button at the middle */}
        <button
          onClick={() => setIsManageMembersModalOpen(true)}
          className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-indigo-500 hover:bg-purple-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
        >
          View Members
        </button>

          {/* Delete Board button at the bottom */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-red-500 hover:bg-purple-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Delete Board
          </button>

        {/* The Modal for Manage Add Member */}
        <CustomModal 
          isOpen={isAddingMembersModalOpen}
          onClose={() => setIsAddingMembersModalOpen(false)}
          title="Add Members"
        >
          <ul>
            {workspaceMembers && workspaceMembers.length > 0 ? (
              workspaceMembers.map(member => (
                <li key={member.id} className="flex justify-between items-center mb-2">
                  <span>{member.username}</span>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsMemberAddModalOpen(true);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Add
                  </button>
                </li>
              ))
            ) : (
              <p>No members found</p>
            )}
          </ul>
        </CustomModal>

        <CustomModal
          isOpen={isMemberAddModalOpen}
          onClose={() => setIsMemberAddModalOpen(false)}
          title="Add Member"
          message={`Are you sure you want to add ${selectedMember?.username} from the workspace to this board?`}
        >
          <div className="flex items-center">
            <button
              onClick={handleAddMember}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Add
            </button>
            <button
              onClick={() => setIsMemberAddModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </CustomModal>

        {/* To view members list */}
        <CustomModal
          isOpen={isManageMembersModalOpen}
          onClose={() => setIsManageMembersModalOpen(false)}
          title="View Members"
        >
         <ul>
            {boardMembers && boardMembers.length > 0 ? (
              boardMembers.map(member => (
                <li key={member.id} className="flex justify-between items-center mb-2">
                  <span>{member.username}</span>
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsMemberDeleteModalOpen(true);
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No members found</p>
            )}
          </ul>
        </CustomModal>

        <CustomModal
          isOpen={isMemberDeleteModalOpen}
          onClose={() => setIsMemberDeleteModalOpen(false)}
          title="Delete Member"
          message={`Are you sure you want to delete ${selectedMember?.username} from this board?`}
        >
          <div className="flex items-center">
            <button
              onClick={handleDeleteMember}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => setIsMemberDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </CustomModal>

        {/* The Modal for Delete Board Confirmation */}
        <CustomModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Board"
          message="Are you sure you want to delete this board?">
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

        {/* The Modal for Delete Canvas Confirmation */}
        <CustomModal
          isOpen={isDeleteCanvasModalOpen}
          onClose={() => setIsDeleteCanvasModalOpen(false)}
          title="Delete Canvas"
          message="Are you sure you want to delete this canvas?"
        >
          <div className="flex items-center">
            <button
              onClick={handleDeleteCanvas}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteCanvasModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </CustomModal>

        {/* Main content container */}
        <div className="w-3/4 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="p-4 bg-white rounded shadow-md">
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setModalIsOpen(true)}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-yellow-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Create New Canvas
              </button>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {canvases.map((canvas) => (
                <li key={canvas.id} className="p-15 border rounded-md" onContextMenu={(e) => handleCanvasRightClick(e, canvas.id)}>
                  {/* Prevent link navigation if editing or deleting */}
                  {!(isEditingCanvasName || isDeletingCanvasName) && (
                    <Link to={`canvas/${canvas.id}`} className="block"
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <div className="text-center font-medium">{canvas.canvasName}</div>
                    </Link>
                  )}
                  {/* Show input field for editing or deleting */}
                  {((isEditingCanvasName && selectedCanvasIdForEdit === canvas.id) || (isDeletingCanvasName && selectedCanvasIdForDelete === canvas.id)) && (
                    <input
                      type="text"
                      value={editedCanvasName}
                      onChange={(e) => setEditedCanvasName(e.target.value)}
                      placeholder="Canvas Name"
                      onKeyPress={(e) => isEditingCanvasName ? handleEditCanvas(e, canvas.id) : handleDeleteCanvas(e, canvas.id)}
                      className="text-center font-medium"
                    />
                  )}
                </li>
              ))}
            </ul>
            {contextMenuVisible && !isEditingCanvasName && !isDeletingCanvasName && ( // Render context menu when visible and not editing or deleting
              <div
                className="absolute bg-white border rounded shadow-md p-2"
                style={{
                  top: contextMenuPosition.top,
                  left: contextMenuPosition.left,
                }}
                onClick={(e) => e.stopPropagation()} // Prevent event propagation
              >
                <button onClick={enterEditMode} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={enterDeleteMode}>Delete</button>
              </div>
            )}
              <CreateCanvasModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onCanvasCreated={fetchCanvases} />
          </div>
        </div>
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

export default MentorBoardContent;