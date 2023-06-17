import React, { useState } from 'react';
import { createBoard, getBoards } from '../services/api';
import { useAuthContext } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation, Link } from 'react-router-dom';

const CreateBoardModal = ({ isOpen, onClose, onBoardCreated }) => {
  const [boardTitle, setBoardTitle] = useState('');
  const [dtTag, setDtTag] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [description, setDescription] = useState('');
  //const [modalIsOpen, setModalIsOpen] = useState(false);
  const [boards, setBoards] = useState([]);

  const { token } = useAuthContext();
  const navigate = useNavigate();
  const location=useLocation();
  const boardTitleFromState = location.state?.boardTitle; 

  const fetchBoards = async () => {
    const response = await getBoards(token);
    if (response.status === 200) {
      setBoards(response.workspaces);
    } else {
      console.error(response.error);
    }
  };

  const handleBoardSubmit = async () => {
    try {
      const formatDeadline = deadline.toISOString();
      // Pass the token to the createBoard function
      const response = await createBoard(token, boardTitle, dtTag, formatDeadline, description);
      console.log("fk u where r u",response);
      if (response.board) {
        const { Board } = response.board;
        // After success, clear the form
        setBoardTitle('');
        setDtTag('');
        setDeadline(''); //css
        setDescription('');
        onClose();
        onBoardCreated();
        console.log("walao")
      } else {
        console.error(response.error);
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
          <h3 className="mb-4 text-lg font-semibold">Create Board</h3>
          <input
            type="text"
            placeholder="Board Title"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={dtTag}
            onChange={(e) => setDtTag(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          >
            <option value="">Select design thinking stage</option>
            <option value="Stage 1">Empathize</option>
            <option value="Stage 2">Define</option>
            <option value="Stage 3">Ideate</option>
            <option value="Stage 4">Prototype</option>
            <option value="Stage 5">Test</option>
          </select>
          <DatePicker 
            selected={deadline}
            onChange={(date)=>setDeadline(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Board Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleBoardSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Create
          </button>
          <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-600">
            Cancel
          </button>
          {/* <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <li key={board.id} className="p-6 border rounded-md">
                <Link to={`/board/${board.id}`} className="block">
                  <div className="text-lg font-medium">{board.boardTitle}</div>
                  <div className="text-gray-600">{board.description}</div>
                  <div className="text-gray-600">{board.dtTag}</div>
                  <div className="text-gray-600">{board.deadline}</div>
                </Link>
              </li>
            ))}
          </ul>
          <CreateBoardModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}  onBoardCreated={fetchBoards} /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;