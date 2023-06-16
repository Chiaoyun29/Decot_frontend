import React, { useEffect, useContext } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import MentorDashboard from './MentorDashboard';
import MenteeDashboard from './MenteeDashboard';
import Navbar from '../common/Navbar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
        user ? (user.role === 'mentor' ? <MentorDashboard /> : <MenteeDashboard />)
             : (<div>Loading...</div>)
      }
    </div>
  );
};

export default Dashboard;