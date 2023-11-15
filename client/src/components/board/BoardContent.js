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
             : (<div className="flex items-center justify-center min-h-screen">
             <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
         </div>)
      }
    </div>
  );
};

export default BoardContent;