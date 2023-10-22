import React, { useState, useEffect } from 'react';
import { registerUser, authenticateWithGoogle, updateUserRole } from '../../components/services/api';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import logo from "../../image/DECOT.png";
import { Link } from 'react-router-dom';
import './auth.css';
import { useAuthContext } from '../../context/AuthContext';
import g_sign_up from  "../../image/google_sign_up.png";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('mentor'); 
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [roleModalIsOpen, setRoleModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const {user, setUser, setToken } = useAuthContext();

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
            } else if (response.status === 400) {
                // User already exists
                setMessageTitle("Error!");
                setMessage('User already exists');
                setModalIsOpen(true);
            } else {
                // Handle other unexpected status codes
                setMessageTitle("Error!");
                setMessage('Failed to register user');
                setModalIsOpen(true);
            }
        } catch (error) {
            setMessageTitle("Error!");
            setMessage('Failed to register user');
            setModalIsOpen(true);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userJSON = urlParams.get('user');
        console.log(token)
        
        // Check if both token and user parameters exist in the URL
        if (token && userJSON) {
            const user = JSON.parse(userJSON);
            console.log(user)
    
            if (user && user.email) {
                setUser(user);
                setToken(token); 
                if (user.role === null) {
                    setRoleModalIsOpen(true);
                } else {
                    navigate("/dashboard");
                }
            } else {
                setMessageTitle("Error!");
                setMessage('Failed to get user data from Google');
                setModalIsOpen(true);
            }
        }
    
        // Since the dependencies array includes navigate, setUser, and setToken, the useEffect will only re-run if any of these change, which is unlikely in this context.
    }, [navigate, setToken, setUser]);

    const handleGoogleRegister = async () => {
        authenticateWithGoogle();
    };
    
    const handleRoleSelection = async (selectedRole) => {
        setRole(selectedRole);
        setRoleModalIsOpen(false);

        try {
            const data = await updateUserRole(user.email, selectedRole);
    
            if (data) {
                setMessageTitle("Registered Successfully");
                setMessage('You have been registered successfully with your google account!');
                setModalIsOpen(true);
            } else {
                setMessageTitle("Error!");
                setMessage('Failed to set user role');
                setModalIsOpen(true);
            }
        } catch (error) {
            setMessageTitle("Error!");
            setMessage('Failed to set user role');
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
                <div className="w-full flex justify-center mt-4">
                    <button onClick={handleRegister} className="w-40 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-blue-700 focus:outline-none">
                        Register
                    </button>
                </div>
               <div className="flex flex-col items-center mt-4 space-y-2">
                    <div className="w-full h-px bg-gray-300"></div> 
                    <p className="text-xs text-gray-600">Or Register With</p>
                    <button 
                        onClick={handleGoogleRegister} 
                        className="mt-4 px-2 py-2 bg-white border border-gray-300 rounded-full hover:bg-blue-100 focus:outline-none"
                    >
                        <img 
                            src={g_sign_up}
                            alt="Register with Google"
                            className="w-40 h-auto"  // Adjust w-24 to the width you want. h-auto will maintain aspect ratio.
                        />
                    </button>
                </div>
                <div className="mt-4 text-grey-600 text-xs">
                    Already have an account?{" "}
                    <span>
                      <Link to="/login" className="underline-offset-0 text-indigo-600 hover:underline">
                       Click here to login
                      </Link>
                    </span>
                </div>
                <CustomModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    title={messageTitle}
                    message={message}
                >
                    {messageTitle === "Congratulations" && (
                        <button
                            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
                            onClick={() => navigate("/login")}
                        >
                            Click here to Login
                        </button>
                    )}
                    {messageTitle === "Registered Successfully" && (
                        <button
                            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
                            onClick={() => navigate("/dashboard")}
                        >
                            Direct to dashboard
                        </button>
                    )}
                </CustomModal>
                <CustomModal
                    isOpen={roleModalIsOpen}
                    onClose={() => setRoleModalIsOpen(false)}
                    title="Select Role"
                    message="Please choose your role"
                >
                    <button
                        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
                        onClick={() => handleRoleSelection('mentor')}
                    >
                        Mentor
                    </button>
                    <button
                        className="mt-4 ml-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none"
                        onClick={() => handleRoleSelection('mentee')}
                    >
                        Mentee
                    </button>
                </CustomModal>
            </div>
        </div>
    );
};

export default Register;