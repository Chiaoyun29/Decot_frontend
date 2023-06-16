import React, { useEffect, useContext } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import MentorWorkspaceContent from './MentorWorkspaceContent';
import MenteeWorkspaceContent from './MenteeWorkspaceContent';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';

const WorkspaceContent = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      {
        user ? (user.role === 'mentor' ? <MentorWorkspaceContent /> : <MenteeWorkspaceContent />)
             : (<div>Loading...</div>)
      }
    </div>
  );
};

export default WorkspaceContent;