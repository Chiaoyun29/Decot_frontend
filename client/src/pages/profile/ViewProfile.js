import React from 'react';
import defaultProfilePic from "/image/user.png";

const ViewProfile = ({ user, onEditClick }) => {
  const profilePicUrl = user.profilePic || defaultProfilePic;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md"> 
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <img 
        src={profilePicUrl} 
        alt="Profile" 
        className="w-20 h-20 rounded-full object-cover mx-auto" // Adjust size as needed
      />
      <p><strong>Username: </strong> {user.username}</p>
      <p><strong>User Role: </strong> {user.role}</p>
      <p><strong>User Email: </strong> {user.email}</p>
      {user.role === "mentor" && (
        <p>
          <strong>Expertise: </strong>
          {user.expertise ? user.expertise : <span className="text-sm text-gray-400 italic">Please add your expertise.</span>}
        </p>
      )}
      <button
        className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2"
        onClick={onEditClick}
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ViewProfile;
