import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import MentorBoardContent from './MentorBoardContent';
import MenteeBoardContent from './MenteeBoardContent';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';

const BoardContent = () => {
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
        user ? (user.role === 'mentor' ? <MentorBoardContent /> : <MenteeBoardContent />)
             : (<div>Loading...</div>)
      }
    </div>
  );
};

export default BoardContent;