import React from 'react';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { CircularProgress } from '@mui/material';

function Login() {
  useDocumentTitle('Login');
  useAuthCheck();
  return <CircularProgress />;
}

export default Login;
