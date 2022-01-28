import Button from '@mui/material/Button';
import React from 'react';
import SearchBar from '../../components/search/SearchBar';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Alert, CircularProgress } from '@mui/material';
import { NoData, PreSearch } from '../../components/search/NoData';
import { useAppSearch } from '../../contexts/SearchContext';

import useApi from '../../hooks/Api';
import { AppItems } from './AppsItems';
import { authConfig } from '../../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';
import { useDebounce } from '../../hooks/Utility';

const noData = NoData;
const preSearch = PreSearch;

const Search = () => {
  let keys: string[] = [];
  const { query } = useAppSearch();
  const opts = { ...authConfig };

  const debouncedValue = useDebounce<string>(query, 200);
  useDocumentTitle('App Search');
  const { isAuthenticated, loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const { loading, error, data, refresh } = useApi(
    `${authConfig.audience}/api/search`,
    debouncedValue,
    opts
  );

  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };

  const checkError = (error: any) => {
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
  };

  if (data) {
    keys = Object.keys(data);
  }

  return (
    <>
      <SearchBar />
      {loading && <CircularProgress />}
      {error && checkError(error)}
      {!error && !loading && query.length === 0 && preSearch}
      {keys.length > 0 && AppItems(keys, data)}
      {!loading && query.length > 0 && keys.length === 0 && noData}
    </>
  );
};

export default Search;
