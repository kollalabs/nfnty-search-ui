import React from 'react';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { CircularProgress } from '@mui/material';

function Login() {
  useDocumentTitle('Login');
  // extract the redirect_uri from the query string, if it is set
  const params = new URLSearchParams(window.location.search);
  useAuthCheck(params.get('redirect_uri') || '/search' );
  return <CircularProgress />;
}

export default Login;
