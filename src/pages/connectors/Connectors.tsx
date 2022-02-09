import Box from '@mui/material/Box';
import React from 'react';
import Typography from '@mui/material/Typography';

import CheckError from '../../components/common/ErrorCheck';
import ConnectorSkeleton from '../../components/skeletons/ConnectorsSkeleton';
import NoResults from '../../components/search/NoResults';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Connector } from '../../models/DataModels';
import { ConnectorItems } from './ConnectorItems';

const Connectors = () => {
  let connectors: string[] = [];
  useDocumentTitle('Connectors');
  useAuthCheck('/connectors');

  const connectorsQuery = useApiQuery<Connector>(['connectors'], 'connectors', {
    method: 'GET',
  });

  if (connectorsQuery.data) {
    // connectors...
    connectors = Object.keys(connectorsQuery.data);
  }

  return (
    <>
      <Box>
        <Typography align={'center'} variant={'h3'} gutterBottom>
          Connectors
        </Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        {connectorsQuery.isFetching && !connectorsQuery.data && (
          <>
            <ConnectorSkeleton />
            <ConnectorSkeleton />
            <ConnectorSkeleton />
          </>
        )}
        {connectorsQuery.error && (
          <CheckError error={connectorsQuery.error} apiRefresh={connectorsQuery.refetch} />
        )}
        {connectors.length > 0 && (
          <ConnectorItems
            connectorItemsKeys={connectors}
            connectorItemsData={connectorsQuery.data}
          />
        )}
        {!connectorsQuery.isFetching && connectors.length === 0 && <NoResults />}
      </Box>
    </>
  );
};

export default Connectors;
