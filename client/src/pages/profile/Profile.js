import React, { useState } from 'react';
import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';
import Navbar from '../../components/common/Navbar';
import { useAuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {isEditing ? (
          <EditProfile 
            user={user} 
            setUser={setUser} 
            isEditing={isEditing} 
            setIsEditing={setIsEditing} 
            onCancel={handleCancelEdit} 
          />
        ) : (
          <ViewProfile 
            user={user} 
            onEditClick={handleEditClick} 
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
