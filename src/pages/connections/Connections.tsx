// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import NoResults from '../../components/search/NoResults';
import React from 'react';
// import Typography from '@mui/material/Typography';

import useApi from '../../hooks/Api';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { SearchItems } from '../search/SearchItems';

const Connections = () => {
  let keys: string[] = [];

  useDocumentTitle('Connections');
  useAuthCheck('/connections');
  const { loading, error, data, refresh } = useApi(`/api/connectors`);

  if (error) {
    console.log('Error:', error);
  }

  if (data) {
    // connectors...
    keys = Object.keys(data);
  }

  return (
    <>
      {loading && <CircularProgress />}
      {error && <CheckError error={error} apiRefresh={refresh} />}
      {keys.length > 0 && SearchItems(keys, data)}
      {!loading && keys.length === 0 && <NoResults />}
    </>
  );
};

export default Connections;
