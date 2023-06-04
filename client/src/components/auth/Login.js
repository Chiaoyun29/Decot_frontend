import React, { useState } from 'react';
import { loginUser } from '../services/api';
import logo from "../image/DECOT.png";
import loginBg from "../image/login_bg.png";

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
    <div 
      className="h-screen bg-no-repeat bg-center bg-cover" 
      style={{ backgroundImage: 'url(${loginBg})' }}
    >
      <div className="flex flex-col w-1/3  text-center m-auto">
        <img src={logo} alt="logo" className="w-5/6 h-5/6 m-auto pt-5" />
        <h1>Login</h1>
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
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;