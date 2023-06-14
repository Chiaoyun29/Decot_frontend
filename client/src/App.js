import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import HomePage from './pages/HomePage';
import WorkspaceContent from './components/workspace/WorkspaceContent';
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/Decot_frontend" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspace/:workspaceId" element={<WorkspaceContent />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;