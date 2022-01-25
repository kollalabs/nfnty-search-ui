import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import React from 'react';
import { CircularProgress } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButton = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <CircularProgress />;
  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthButton;
