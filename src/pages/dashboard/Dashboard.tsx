import React from 'react';
import useApi from '../../hooks/Api';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Alert, CircularProgress } from '@mui/material';
import { authConfig } from '../../config/auth';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard = () => {
  const opts = {
    scope: authConfig.scope
  };
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
    return <CircularProgress/>;
  }

  if (error !== null) {
    if (error.error === 'login_required') {
      return <button onClick={() => loginWithRedirect(opts)}>Login</button>;
    }
    if (error.error === 'consent_required') {
      return (
        <button onClick={getTokenAndTryAgain}>Consent to reading users</button>
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
