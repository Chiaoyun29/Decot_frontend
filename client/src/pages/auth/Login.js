import React, { useState, useEffect } from 'react';
import { loginUser, authenticateWithGoogle, updateUserRole, changePassword } from '../../components/services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomModal from '../../components/common/CustomModal';
import logo from "../../image/DECOT.png";
import { Link } from 'react-router-dom';
import './auth.css';
import { useAuthContext } from '../../context/AuthContext';
import g_sign_in from "../../image/google_sign_in.png";

const Login = () => {
    const { user, setUser, setToken } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const [roleModalIsOpen, setRoleModalIsOpen] = useState(false);
    const [role, setRole] = useState('mentor');

    const handleLogin = async () => {
        try {
            const response = await loginUser(email, password);

            if (response.status === 200) {
                setUser(response.user); // set user in context
                setToken(response.token); // set token in context
                const postLoginRedirect = JSON.parse(sessionStorage.getItem('postLoginRedirect'));
                if (postLoginRedirect?.from === 'joinWorkspace' && postLoginRedirect?.token) {
                    console.log("got COme here?")
                    navigate(`/join/${postLoginRedirect.token}`);
                } else {
                    navigate("/dashboard");
                }
            } else if (response.status === 401) {
                setMessageTitle('Error');
                setMessage('Invalid credentials');
                setModalIsOpen(true);
            } else {
                setMessageTitle('Error');
                setMessage('Failed to login');
                setModalIsOpen(true);
            }
        } catch (error) {
            setMessageTitle('Error');
            setMessage('An error occurred while trying to log in');
            setModalIsOpen(true);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userJSON = urlParams.get('user');
        console.log(token)

        // Check if both token and user parameters exist in the URL
        // Check for Google login redirect
        const postLoginRedirect = JSON.parse(sessionStorage.getItem('postLoginRedirect'));
        if (postLoginRedirect?.from === 'joinWorkspace' && postLoginRedirect?.token) {
            if (token && userJSON) {
                const user = JSON.parse(userJSON);

                setUser(user);
                setToken(token);

                if (user?.role === null) {
                    setRoleModalIsOpen(true);
                } else {
                    navigate(`/join/${postLoginRedirect.token}`);
                }
            }
        }

        // Normal login process
        else if (!postLoginRedirect && token && userJSON) {
            const user = JSON.parse(userJSON);

            setUser(user);
            setToken(token);

            if (user?.role === null) {
                setRoleModalIsOpen(true);
            } else {
                navigate("/dashboard");
            }
        }
    }, [navigate, setUser, setToken]);

    const handleGoogleLogin = async () => {
        authenticateWithGoogle();
    };

    const handleRoleSelection = async (selectedRole) => {
        setRole(selectedRole);
        setRoleModalIsOpen(false);

        try {
            const data = await updateUserRole(user.email, selectedRole);

            if (data) {
                setUser(data.user)
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
        <div className="bg flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
            <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
                <div className="flex flex-col items-center">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-1/4 h-1/4 m-auto pt-5" />
                    </Link>
                </div>
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
                <div className="w-full flex justify-center mt-4">
                    <button onClick={handleLogin} className="w-40 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-blue-700 focus:outline-none">
                        Login
                    </button>
                </div>
                <div className="flex flex-col items-center mt-4 space-y-2">
                    <div className="w-full h-px bg-gray-300"></div>
                    <p className="text-xs text-gray-600">Or Login With</p>
                    <button
                        onClick={handleGoogleLogin}
                        className="mt-4 px-2 py-2 bg-white border border-gray-300 rounded-full hover:bg-blue-100 focus:outline-none"
                    >
                        <img
                            src={g_sign_in}
                            alt="Login with Google"
                            className="w-40 h-auto"  // Adjust w-24 to the width you want. h-auto will maintain aspect ratio.
                        />
                    </button>
                </div>

                <div className="mt-4 text-grey-600 text-xs">
                    Don't have an account?{" "}
                    <span>
                        <Link to="/register" className=" underline-offset-0 text-indigo-600 hover:underline">
                            Click here to register
                        </Link>
                    </span>
                </div>
                <CustomModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    title={messageTitle}
                    message={message}
                >
                    {messageTitle === "Registered Successfully" && (
                        <button
                            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none"
                            onClick={() => {
                                const postLoginRedirect = JSON.parse(sessionStorage.getItem('postLoginRedirect'));
                                if (postLoginRedirect?.from === 'joinWorkspace' && postLoginRedirect?.token) {
                                    navigate(`/join/${postLoginRedirect.token}`);
                                } else {
                                    navigate("/dashboard");
                                }
                            }}
                        >
                            Proceed
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

export default Login;
