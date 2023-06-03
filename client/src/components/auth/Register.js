import React, { useState } from 'react';
import { registerUser } from '../services/api';
import CustomModal from '../common/customModal';
import logo from "../image/DECOT.png";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await registerUser(username, email, password);
      if (response.error) {
        setModalIsOpen(true);
        setErrorMessage(response.error);
      } else {
        setErrorMessage('');
        setModalIsOpen(false);
        // Redirect the user to the login page or homepage after successful registration
        // For example: history.push("/login")
      }
    } catch (error) {
      setErrorMessage(error.message);
      setModalIsOpen(true);
    }
  };

  return (
    <div>
      <img src={logo} alt="logo" className="w-5/6 h-5/6 m-auto pt-5" />
      <h1>Register</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
      <CustomModal 
      isOpen={modalIsOpen} 
      onClose={() => setModalIsOpen(false)} 
      title="Error" 
      message={errorMessage} />
    </div>
  );
};

export default Register;