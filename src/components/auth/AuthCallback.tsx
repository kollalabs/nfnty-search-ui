import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function AuthCallback() {
  const { isAuthenticated } = useAuth0();

  const props: any = {
    replace: true,
    to: isAuthenticated? '/search': '/login',
  };

  return <Navigate {...props} />;
}

export default AuthCallback;
