import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { joinWorkspace } from '../components/services/api';

const JoinWorkspacePage = () => {
  const { token: joinToken } = useParams(); // Token from the invite link
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { token } = useAuthContext();
  const [hasNavigated, setHasNavigated] = useState(false);

  const joinAndNavigate = async () => {
    const response = await joinWorkspace(token, joinToken);
    console.log(response.workspaceId)
    if (response.message) {
      sessionStorage.removeItem('postLoginRedirect');
      navigate(`/workspace/${response.workspaceId}`);
    } else {
      console.error('Error joining workspace:', response.error);
    }
  };

  useEffect(() => {
    if (!user && !hasNavigated) {
      console.log("Not authenticated, navigating to login");
      sessionStorage.setItem('postLoginRedirect', JSON.stringify({
        from: 'joinWorkspace',
        token: joinToken
      }));
      setHasNavigated(true);
      navigate('/login');
    } else if (user) {
      console.log("Already authenticated, attempting to join the workspace");
      joinAndNavigate();
    }
  }, [user, navigate, joinToken, hasNavigated]);

  return (
    <div>
      <h1>Joining Workspace...</h1>
      <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
    </div>
  );
};

export default JoinWorkspacePage;