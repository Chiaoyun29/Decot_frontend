import React, { useState } from 'react';
import { loginUser } from '../../components/services/api';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import logo from "../../image/DECOT.png";
import { Link } from 'react-router-dom';
import './auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);
            if (response.ok) {
                const data = await response.json();
                const { token } = data;
                console.log('User logged in successfully. Token:', token);
                // Redirect the user to the dashboard or homepage after successful login
                // For example: navigate("/dashboard");
            } else {
                setModalIsOpen(true);
                setErrorMessage('Authentication failed');
            }
        } catch (error) {
            setErrorMessage(error.message);
            setModalIsOpen(true);
        }
    };

    return (
        <div className="bg flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
            <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
                <div className="flex flex-col items-center">
                  <Link to="/Decot_frontend">
                    <img src={logo} alt="logo" className="w-1/4 h-1/4 m-auto pt-5" />
                  </Link>
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
                <button onClick={handleLogin} className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none">
                    Login
                </button>
                <div className="mt-4 text-grey-600 text-xs">
                    Don't have an account?{" "}
                    <span>
                        <Link to="/register" className=" underline-offset-0 text-blue-600 hover:underline">
                            Click here to register
                        </Link>
                    </span>
                </div>
                <CustomModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    title="Error"
                    message={errorMessage}
                />
            </div>
        </div>
    );
};

export default Login;