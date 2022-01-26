import Button from '@mui/material/Button';
import React from 'react';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Alert, CircularProgress } from '@mui/material';
import { authConfig } from '../../config/authConfig';
import { useApi } from '../../hooks/Api';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  let keys: string[] = [];
  const opts = { ...authConfig };

  useDocumentTitle('App Dashboard');

  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const { loading, error, data, refresh } = useApi(
    `${window.location.origin}/api/search`,
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

  if (data) {
    keys = Object.keys(data);
  }
  return (
    <ul>
      {keys.length > 0 &&
        keys.map((result, index) => {
          return <li key={index}>{result}</li>;
        })}
      {keys.length === 0 && <Alert severity={'info'}>No data found</Alert>}
    </ul>
  );
};

export default Dashboard;
