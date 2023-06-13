import React, { useState } from 'react';
import { registerUser } from '../../components/services/api';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/customModal';
import logo from "../../image/DECOT.png";
import { Link } from 'react-router-dom';
import './auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('mentor'); 
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setMessageTitle("Error!");
            setMessage('Passwords do not match');
            setModalIsOpen(true);
            return;
        }
    
        try {
            const response = await registerUser(username, email, password, role);
    
            if (response.status === 201) {
                setMessageTitle("Congratulations");
                setMessage('You have been registered successfully!');
                setModalIsOpen(true);
                // Registration successful
                // Redirect the user to the login page or homepage
                // For example: navigate("/login");
            } else if (response.status === 400) {
                // User already exists
                setMessageTitle("Error!");
                setMessage('User already exists');
                setModalIsOpen(true);
            } else {
                // Handle other unexpected status codes
                setMessageTitle("Error!");
                setMessage('Failed to register user FK u');
                setModalIsOpen(true);
            }
        } catch (error) {
            setMessageTitle("Error!");
            setMessage('Failed to register user');
            setModalIsOpen(true);
        }
    };

    return (
        <div className="bg-blend-darken bg flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-black-800">
            <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
                <div className="flex flex-col items-center">
                  <Link to="/Decot_frontend">
                    <img src={logo} alt="logo" className="w-1/4 h-1/4 m-auto pt-5" />
                  </Link>
                </div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="block w-full mt-2 border-gray-400 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                /><br />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                /><br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                /><br />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                /><br />
                <div className="flex items-center space-x-4 mt-2">
                    Choose Role:<br />
                    <label>
                        <input
                        type="radio"
                        value="mentor"
                        checked={role === 'mentor'}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-1"
                        />
                        Mentor
                    </label>
                    <label>
                        <input
                        type="radio"
                        value="mentee"
                        checked={role === 'mentee'}
                        onChange={(e) => setRole(e.target.value)}
                        className="mr-1"
                        />
                        Mentee
                    </label>
                    </div>
                <br></br>
                <button onClick={handleRegister} className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none">
                    Register
                </button>
                <div className="mt-4 text-grey-600 text-xs">
                    Already have an account?{" "}
                    <span>
                      <Link to="/login" className="underline-offset-0 text-blue-600 hover:underline">
                       Click here to login
                      </Link>
                    </span>
                </div>
                <CustomModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    title= {messageTitle}
                    message={message}
                />
            </div>
        </div>
    );
};

export default Register;