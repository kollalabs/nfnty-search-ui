// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import NoResults from '../../components/search/NoResults';
import React from 'react';
// import Typography from '@mui/material/Typography';

import useApi from '../../hooks/Api';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { ConnectionItems } from './ConnectionItems';

const Connections = () => {
  let connectors: string[] = [];

  useDocumentTitle('Connectors');
  useAuthCheck('/connectors');
  const { loading, error, data, refresh } = useApi(`/api/connectors`);

  if (data) {
    // connectors...
    connectors = Object.keys(data);
  }

  return (
    <>
      <Typography align={'center'} variant={'h3'} gutterBottom>
        Connectors
      </Typography>
      {loading && <CircularProgress />}
      {error && <CheckError error={error} apiRefresh={refresh} />}
      {connectors.length > 0 && ConnectionItems(connectors, { ...data, ...data })}
      {!loading && connectors.length === 0 && <NoResults />}
    </>
  );
};

export default Connections;
