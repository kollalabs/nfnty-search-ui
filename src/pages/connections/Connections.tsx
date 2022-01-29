// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { NoData, PreSearch } from '../../components/search/NoData';
// import Typography from '@mui/material/Typography';

import useApi from '../../hooks/Api';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { SearchItems } from '../search/SearchItems';

const Connections = () => {
  let keys: string[] = [];

  useDocumentTitle('Connections');
  useAuthCheck('/connections');
  const { loading, error, data, refresh } = useApi(`/api/connections`);

  if (data) {
    // companies...
    keys = Object.keys(data);
  }

  return (
    <>
      {loading && <CircularProgress />}
      {error && <CheckError error={error} apiRefresh={refresh} />}
      {!error && !loading && <PreSearch />}
      {keys.length > 0 && SearchItems(keys, data)}
      {!loading && keys.length === 0 && <NoData />}
    </>
  );
};

export default Connections;
