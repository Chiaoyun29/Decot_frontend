import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <div className="bg">
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          
          <nav>
            <ul>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
          
        </Router>
      </div>
    </div>
  );
};

export default App;