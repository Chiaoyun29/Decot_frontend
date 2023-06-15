import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getWorkspaceById, updateWorkspace, deleteWorkspace, getWorkspaceMembers, removeWorkspaceMember } from '../services/api';
import CustomModal from '../common/CustomModal';

const MentorWorkspaceContent = () => {
  const { workspaceId } = useParams();
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

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await getWorkspaceById(token, workspaceId);
      if (response.workspace) {
        setWorkspace(response.workspace);
      } else {
        console.error(response.error);
      }
    };
    fetchWorkspace();
  }, [workspaceId, token]);

  useEffect(() => {
    if (isManageMembersModalOpen) {
      fetchWorkspaceMembers();
    }
  }, [isManageMembersModalOpen]);

  const fetchWorkspaceMembers = async () => {
    try {
      const members = await getWorkspaceMembers(token, workspaceId);
      console.log("here" + JSON.stringify(members));
      setWorkspaceMembers(members);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(workspace.joinToken);
      alert('Code copied successfully!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!workspace) return <div>Loading...</div>;

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
      // You may want to redirect to dashboard or somewhere else
      console.log("Workspace deleted successfully.");
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
    <div className="p-6 flex">
      {/* Sidebar for managing workspace */}
      <div className="w-1/4 bg-gray-100 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Manage Workspace</h3>
        {isEditing ? (
          <div>
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
            <button
              onClick={handleUpdateWorkspace}
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
            <h3 className="mb-2 font-medium">{workspace.name}</h3>
            <p className="mb-2 text-sm text-gray-600">{workspace.description}</p>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedName(workspace.name);
                setEditedDescription(workspace.description);
              }}
              className="mb-4 mr-2 px-3 py-1 bg-yellow-500 text-white rounded-md"
            >
              Edit
            </button>
          </div>
        )}

        {/* Invite button that opens modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Invite Members
        </button>
        
         {/* Manage members */}
        <button
          onClick={() => setIsManageMembersModalOpen(true)}
          className="mb-4 px-4 py-2 bg-purple-500 text-white rounded-md"
        >
          Manage Members
        </button>

        {/* Delete Workspace button at the bottom */}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-auto px-3 py-1 bg-red-500 text-white rounded-md"
        >
          Delete Workspace
        </button>

        {/* The Modal for Invite */}
        <CustomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Invite Members"
          message="Share this code with the members you want to invite:"
        >
          <div className="flex items-center">
            <span className="mr-4">{workspace.joinToken}</span>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Copy Code
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
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-semibold mb-4">{workspace.name}</h2>
        <p className="text-gray-600 mb-4">{workspace.description}</p>
        {/* Add content such as boards here */}
      </div>
    </div>
  );
};

export default MentorWorkspaceContent;