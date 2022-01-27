import Button from '@mui/material/Button';
import React from 'react';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Alert, CircularProgress } from '@mui/material';
import { NoData, PreSearch } from '../../components/search/NoData';
import { useAppSearch } from '../../contexts/SearchContext';

import { AppItems } from './AppsItems';
import { authConfig } from '../../config/authConfig';
import { useApi } from '../../hooks/Api';
import { useAuth0 } from '@auth0/auth0-react';

const noData = NoData;
const preSearch = PreSearch;

const Apps = () => {
  let keys: string[] = [];

  const { query } = useAppSearch();
  useDocumentTitle('App Apps');
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const opts = { ...authConfig };
  const { loading, error, data, refresh } = useApi(
    `${window.location.origin}/api/search`,
    query,
    opts
  );

  if (query.length === 0) return preSearch;

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
    if (error.message.toLowerCase() !== 'The user aborted a request') {
      return <Alert severity="error">Oops... {error.message}</Alert>;
    }
  }

  if (data) {
    keys = Object.keys(data);
  }

  return (
    <>
      {keys.length > 0 && AppItems(keys, data)}
      {keys.length === 0 && noData}
    </>
  );
};

export default Apps;
