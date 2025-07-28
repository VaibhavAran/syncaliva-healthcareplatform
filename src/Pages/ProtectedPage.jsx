import React, { useContext } from 'react';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';

const ProtectedPage = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="protected-wrapper">
        <div className="blur-content">{children}</div>
        <div className="overlay">
          <p>Please sign in to view full content</p>
          <button onClick={() => navigate('/signin')}>Sign In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
