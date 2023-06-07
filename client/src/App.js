import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Canvas } from './components/board/Canvas';
import { Palette }  from './components/board/Palette';
import { PropertiesPanel } from './components/board/PropertiesPanel';
import "./App.css";

const App = () => {
  return(
    <>
      <Palette />
      <Canvas />
      <PropertiesPanel />
      <div className="App">
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
      </div>
    </>
  );
};

export default App;