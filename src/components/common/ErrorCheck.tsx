import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import React from 'react';
import { authConfig } from '../../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';

const opts = { ...authConfig };

const CheckError = (error: any, apiRefresh?: () => void) => {
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    apiRefresh && apiRefresh();
  };

  if (error !== null) {
    if (error?.error === 'login_required') {
      return (
        <Button variant={'contained'} onClick={() => loginWithRedirect(opts)}>
          Login
        </Button>
      );
    }
    if (error?.error === 'consent_required') {
      return (
        <Button variant={'contained'} onClick={getTokenAndTryAgain}>
          Consent to reading users
        </Button>
      );
    }
    if (error?.message?.toLowerCase() !== 'The user aborted a request') {
      return (
        <Alert severity="error">Drat... {error?.message || 'An unspecified error occurred'}</Alert>
      );
    }
  }

  return null;
};

export default CheckError;
