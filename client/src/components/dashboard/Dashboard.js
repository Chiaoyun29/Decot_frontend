import React from 'react';
import MentorDashboard from './MentorDashboard';
import MenteeDashboard from './MenteeDashboard';
import Navbar from '../common/Navbar';

const Dashboard = ({ userRole }) => {
  return (
    <div>
      <Navbar />
      {userRole === 'mentor' ? <MentorDashboard /> : <MenteeDashboard />}
    </div>
  );
};

export default Dashboard;