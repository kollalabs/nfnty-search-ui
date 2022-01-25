import AuthButton from '../../components/auth/AuthButton';
import React from 'react';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Login() {
  useDocumentTitle('Login');
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <CircularProgress />;
  if (isAuthenticated) return <Navigate to="/apps" replace />;

  return <AuthButton />;
}

export default Login;
