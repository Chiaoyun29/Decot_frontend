import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Canvas from './components/canvas/canvas_draft'
import "./App.css";

const App = () => {
  return (
    <><Canvas /><div className="App"> //need to figure out how to separate
      <div className="bg">
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <nav>
            <ul className="list-none">
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
    </div></>
  );
};

export default App;