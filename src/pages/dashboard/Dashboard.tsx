import Button from '@mui/material/Button';
import React from 'react';
import useApi from '../../hooks/Api';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Alert, CircularProgress } from '@mui/material';
import { authConfig } from '../../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const opts = { ...authConfig };
  useDocumentTitle('App Dashboard');
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const { loading, error, data, refresh } = useApi(
    'https://infinitysearch.com/api/search',
    opts
  );

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error !== null) {
    if (error.error === 'login_required') {
      return (
        <Button variant={'contained'} onClick={() => loginWithRedirect(opts)}>
          Login
        </Button>
      );
    }
    if (error.error === 'consent_required') {
      return (
        <Button variant={'contained'} onClick={getTokenAndTryAgain}>
          Consent to reading users
        </Button>
      );
    }
    return <Alert severity="error">Oops... {error.message}</Alert>;
  }

  return (
    <ul>
      {data.map((results, index) => {
        return <li key={index}>{results}</li>;
      })}
    </ul>
  );
};

export default Dashboard;
