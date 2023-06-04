import React, { useState } from 'react';
import { loginUser } from '../services/api';
import logo from "../../image/DECOT.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        console.log('User logged in successfully. Token:', token);
      } else {
        console.log('Authentication failed');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  };

  return (
    <div className="box">
      <img src={logo} alt="logo" className="w-5/6 h-5/6 m-auto pt-5" />
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-64 h-10 rounded-md border-2 border-gray-300 mb-2 px-2"
      /><br />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-64 h-10 rounded-md border-2 border-gray-300 mb-2 px-2"
      /><br />
      <button onClick={handleLogin}className="w-64 h-10 bg-blue-500 text-white rounded-md">Login</button>
    </div>
  );
};

export default Login;