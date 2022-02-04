import React, { useEffect } from 'react';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { CircularProgress } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

function Logout() {
  useDocumentTitle('Logout');
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ returnTo: `${window.location.origin}/start.html` });
  });
  return <CircularProgress />;
}

export default Logout;
