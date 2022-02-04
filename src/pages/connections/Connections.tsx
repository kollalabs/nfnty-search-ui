import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Typography from '@mui/material/Typography';

import CheckError from '../../components/common/ErrorCheck';
import NoResults from '../../components/search/NoResults';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { ConnectionItems } from './ConnectionItems';
import { Connector } from '../../models/DataModels';
import { useAuth } from '../../contexts/AuthContext';

const Connections = () => {
  let connectors: string[] = [];
  useDocumentTitle('Connectors');
  useAuthCheck('/connectors');
  const token = useAuth();

  const connectorsQuery = useApiQuery<Connector>(
    ['connectors'],
    'connectors',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    {
      enabled: Boolean(token && token.length > 0),
    }
  );

  if (connectorsQuery.data) {
    // connectors...
    connectors = Object.keys(connectorsQuery.data);
  }

  return (
    <>
      <Typography align={'center'} variant={'h3'} gutterBottom>
        Connectors
      </Typography>
      {connectorsQuery.isFetching && <CircularProgress />}
      {connectorsQuery.error && (
        <CheckError error={connectorsQuery.error} apiRefresh={connectorsQuery.refetch} />
      )}
      {connectors.length > 0 && ConnectionItems(connectors, connectorsQuery.data)}
      {!connectorsQuery.isFetching && connectors.length === 0 && <NoResults />}
    </>
  );
};

export default Connections;
