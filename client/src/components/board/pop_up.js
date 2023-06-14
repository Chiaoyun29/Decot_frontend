import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Canvas from './Canvas.js';

const pop_up = ({ onClose })=>{
    const [title, setTitle] = useState('');
    const [label, setLabel] = useState('');
    const [deadline, setDeadline] = useState(null);

    const handleCreateCanvas = ()=>{

        axios
            .post('/api/canvas', { title, label, deadline})
            .then((response)=>{
                <Canvas />
                onClose();
            })
            .catch((error)=>{

            });
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create New Canvas</h2>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="title">
                Title:
              </label>
              <input
                id="title"
                type="text"
                className="border rounded p-2 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="label">
                Design Thinking Stage:
              </label>
              <select
                id="label"
                className="border rounded p-2 w-full"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              >
                <option value="">Select Design Thinking Level</option>
                <option value="Stage 1">Stage 1</option>
                <option value="Stage 2">Stage 2</option>
                <option value="Stage 3">Stage 3</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="deadline">
                Deadline:
              </label>
              <DatePicker
                id="deadline"
                className="border rounded p-2 w-full"
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleCreateCanvas}
              >
                Create
              </button>
              <button
                className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
    );
};
export default pop_up;