import React, { useState, useEffect, useContext} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getWorkspaceById, updateWorkspace, deleteWorkspace, getWorkspaceMembers, removeWorkspaceMember, getBoards } from '../services/api';
import CustomModal from '../common/CustomModal';
import SocketContext from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import icon_pencil from  "../../image/icon_pencil.svg";
import CreateBoardModal from '../dashboard/CreateBoardModal';

const MentorWorkspaceContent = () => {
  const { workspaceId, boardId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { token } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [isMemberDeleteModalOpen, setIsMemberDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const { socket, addNotificationCallback, removeNotificationCallback } = useContext(SocketContext);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState(null);

  const fetchBoards = async () => {
    const response = await getBoards(token, workspaceId);
    console.log(response);
    if (response.status === 200) {
      setBoards(response.boards);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [workspaceId, token]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await getWorkspaceById(token, workspaceId);
      if (response.workspace) {
        socket.emit('userAction', { action: 'viewWorkspace' });
        setWorkspace(response.workspace);
      } else {
        console.error(response.error);
      }
    };
    fetchWorkspace();
  }, [workspaceId, token]);

  useEffect(() => {
    if (socket) {
      const callback = (message) => {
      };
      addNotificationCallback(callback);
    return () => {
      removeNotificationCallback(callback);
    };
    }
  }, [socket]);

  useEffect(() => {
    if (isManageMembersModalOpen) {
      fetchWorkspaceMembers();
    }
  }, [isManageMembersModalOpen]);

  const fetchWorkspaceMembers = async () => {
    try {
      const members = await getWorkspaceMembers(token, workspaceId);
      setWorkspaceMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(workspace.joinToken);
      setIsCopied(true); // Set isCopied to true
      socket.emit('userAction', { action: 'copyJoinCode' });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!workspace) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
        </div>
    );
  }

  const handleUpdateWorkspace = async () => {
    const response = await updateWorkspace(token, workspaceId, {
      name: editedName,
      description: editedDescription
    });
    if (response.status === 200) {
      setWorkspace(response.workspace);
      setIsEditing(false);
    } else {
      console.error(response.error);
    }
  };
  
  const handleDeleteWorkspace = async () => {
    const response = await deleteWorkspace(token, workspaceId);
    if (response.status === 200) {
      navigate('/dashboard');
    } else {
      console.error(response.error);
    }
  };

  const handleDeleteMember = async () => {
    const response = await removeWorkspaceMember(token, workspaceId, selectedMember.id);
    if (response.status === 200) {
      fetchWorkspaceMembers(); // refresh the members list
      setIsMemberDeleteModalOpen(false);
    } else {
      console.error(response.error);
    }
  };

  return (
      <div className="flex flex-col h-screen bg-gray-100">
      {/* Fixed Sidebar for managing workspace */}
      <div className="flex flex-grow overflow-hidden">
      <div className="w-1/4 h-full bg-white shadow-lg p-4 overflow-y-auto">
        {isEditing ? (
          <div className="p-4 my-2 bg-gray-100 text-gray-500">
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="mb-2 w-full px-3 py-2 border rounded-md"
              placeholder="Workspace Name"
            />
            <input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="mb-2 w-full px-3 py-2 border rounded-md"
              placeholder="Workspace Description"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdateWorkspace}
                className="mr-2 px-3 py-1 bg-indigo-500 text-white rounded-md"
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
              <h3 className="uppercase mb-2 text-3xl font-bold">{workspace.name}</h3>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditedName(workspace.name);
                  setEditedDescription(workspace.description);
                }}
                className="text-xl text-blue-500"
              >
                <img src={icon_pencil} alt="edit icon" className="w-4 h-4" />
              </button>
            </div>
            <p className="mb-2 text-xl text-gray-600">{workspace.description}</p>
          </div>
        )}

        {/* Sidebar Options */}
      <div className="flex flex-col flex-grow mt-4">
        <div className="mt-auto"> {/* This div will grow and push the buttons to the bottom */}
          {/* Invite button that opens modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Invite Members
          </button>

          {/* Manage members */}
          <button
            onClick={() => setIsManageMembersModalOpen(true)}
            className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-indigo-500 hover:bg-purple-600 focus:ring-indigo-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Manage Members
          </button>

          {/* Delete Workspace button at the bottom */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="font-semibold w-full flex items-center justify-center py-2 px-4 my-3 text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 focus:ring-offset-yellow-200 transition ease-in duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          >
            Delete Workspace
          </button>
        </div>
      </div>

      {/* The Modal for Invite */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsCopied(false); // Reset isCopied state when modal is closed
        }}
        title="Invite Members"
        message="Share this code with the members you want to invite:"
      >
        <div className="flex items-center">
          <span className="mr-4">{workspace.joinToken}</span>
          <button
            onClick={handleCopyCode}
            className={
              isCopied
                ? "px-4 py-2 font-semibold bg-green-500 text-white rounded-md"
                : "px-4 py-2 font-semibold rounded-md bg-gray-100"
            } // Modify the class names based on isCopied state
          >
            {isCopied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </CustomModal>

      {/* The Modal for Delete Workspace Confirmation */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Workspace"
        message="Are you sure you want to delete this workspace?"
      >
        <div className="flex items-center">
          <button
            onClick={handleDeleteWorkspace}
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

    {/* The Modal for Manage Member */}
    <CustomModal
      isOpen={isManageMembersModalOpen}
      onClose={() => setIsManageMembersModalOpen(false)}
      title="Manage Members"
    >
      <ul>
        {workspaceMembers && workspaceMembers.length > 0 ? (
          workspaceMembers.map(member => (
            <li key={member.id} className="flex justify-between items-center mb-2">
              <span>{member.username}</span>
              <button
                onClick={() => {
                  setSelectedMember(member);
                  setIsMemberDeleteModalOpen(true);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded-md"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p>No members found</p>
        )}
      </ul>
    </CustomModal>

    {/* The Modal for Delete Member Confirmation */}
    <CustomModal
      isOpen={isMemberDeleteModalOpen}
      onClose={() => setIsMemberDeleteModalOpen(false)}
      title="Delete Member"
      message={`Are you sure you want to remove ${selectedMember?.name} from the workspace?`}
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

    {/* Main content container */}
    <div className="w-3/4 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
        <h2 className="text-2xl font-semibold mb-4 uppercase">{workspace.name}</h2>
        <p className="text-gray-600 mb-4">{workspace.description}</p>
        <div className="absolute right-0 pr-10">
          
        </div>
        {/* Your main content */}
        {/* Section */}
        <div className="p-4 bg-white rounded shadow-md">
          {/* ... content for section 1 ... */}
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setModalIsOpen(true)}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-yellow-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              >
                Create Board
              </button>
            </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <li key={board.id} className="p-15 border rounded-md">
                <Link to={`board/${board.id}`} className="block" //need to do modi for linkage
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <div className="text-center font-medium">{board.boardTitle}</div>
                  <div className="text-center text-gray-600">{board.description}</div>
                  <div className="text-center text-gray-600">{board.dtTag}</div>
                  <div className="text-center text-gray-600">
                    {(board.deadline).toLocaleString('en-US',{
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'auto',
                    })}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <CreateBoardModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}  onBoardCreated={fetchBoards} />
        </div>
        {/* Section */}
      </div>
    </div>
  </div>
  );
};

export default MentorWorkspaceContent;