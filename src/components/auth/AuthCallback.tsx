import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function AuthCallback() {
  const { isAuthenticated } = useAuth0();
  let goTo = <Navigate to={'/login'} replace/>;

  console.log('isAuthenticated:', isAuthenticated);

  if (isAuthenticated) {
    goTo = <Navigate to={'/apps'} replace/>;
  }

  console.log('GOTO:', goTo);
  return goTo;
}

export default AuthCallback;