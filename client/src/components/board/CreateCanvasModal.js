import React, { useState, useEffect } from 'react';
import { createCanvas } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const CreateCanvasModal = ({ isOpen, onClose, onCanvasCreated }) => {
  const { boardId, workspaceId } = useParams();
  const [canvasName, setCanvasName] = useState('');

  const { token } = useAuthContext();

  const handleCanvasSubmit = async () => {
    try {
      const response = await createCanvas(token, boardId, workspaceId, canvasName);
      console.log(response);
      if (response.canvas) {
        // After success, clear the form
        setCanvasName('');
        onClose();
        onCanvasCreated();
        console.log("walao")
      } else {
        console.error("err:" + response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-1/3 bg-white rounded-md">
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Create Canvas</h3>
          <input
            type="text"
            placeholder="Canvas Name"
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          />

          <button
            onClick={handleCanvasSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Create
          </button>
          <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCanvasModal;