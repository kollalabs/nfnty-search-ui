import React, { useEffect } from 'react';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { CircularProgress } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function Login() {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated) {
        navigate('/apps');
      } else {
        await loginWithRedirect();
      }
    }

    checkAuth().then(() => null);
  }, [isAuthenticated, loginWithRedirect]);

  if (isLoading) return <CircularProgress />;

  return null;
}

export default Login;
