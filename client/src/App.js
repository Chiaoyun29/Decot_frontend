import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import HomePage from './pages/HomePage';
import WorkspaceContent from './components/workspace/WorkspaceContent';
import BoardContent from './components/board/BoardContent';
import Canvas from './components/canvas/Canvas';
import Chat from './components/chat/Chat';
import "./App.css";
import { ToastContainer } from 'react-toastify';
import SocketProvider from './context/SocketProvider';
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./pages/profile/Profile"

const App = () => {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
          <AuthProvider>
            <SocketProvider>
              <Routes>
                <Route path="/Decot_frontend" element={<HomePage />} />
                <Route path="/Decot_frontend/googleCallback" element={<Register />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/workspace/:workspaceId" element={<WorkspaceContent />} />
                <Route path="/workspace/:workspaceId/board/:boardId" element={<BoardContent />} />
                <Route path="/board/:boardId/canvas" element={<Canvas />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </SocketProvider>
          </AuthProvider>
      </Router>
    </div>
  );
};

export default App;