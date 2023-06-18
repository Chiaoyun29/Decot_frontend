import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import HomePage from './pages/HomePage';
import WorkspaceContent from './components/workspace/WorkspaceContent';
import BoardContent from './components/board/BoardContent';
import Message from './components/chat/Chat';
import Canvas from './components/canvas/Canvas';
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Routes>
              <Route path="/Decot_frontend" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workspace/:workspaceId" element={<WorkspaceContent />} />
              <Route path="/board/:boardId" element={<BoardContent />} />
              <Route path="/chat" element={<Message />} />
              <Route path="/canvas" element={<Canvas />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;