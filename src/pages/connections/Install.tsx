import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import NoResults from '../../components/search/NoResults';
import React from 'react';
import Typography from '@mui/material/Typography';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';

import { Connector } from '../../models/DataModels';
import { useLocation } from 'react-router-dom';


const Install = () => {
  let connectors: string[] = [];

  const search = useLocation().search;
  const target = new URLSearchParams(search).get('target');

  useDocumentTitle('Install Connector');
  useAuthCheck('/install'+search);

  const connectorsQuery = useApiQuery<Connector>(['connectors'], 'connectors', {
    method: 'GET',
  });

  return (
    <>
      <Typography align={'center'} variant={'h3'} gutterBottom>
        Install [{target}] Connector
      </Typography>
      {connectorsQuery.isFetching && <CircularProgress />}
      {connectorsQuery.error && (
        <CheckError error={connectorsQuery.error} apiRefresh={connectorsQuery.refetch} />
      )}
      {connectors.length > 0 && InstallRedirect(connectors, connectorsQuery.data)}
      {!connectorsQuery.isFetching && connectors.length === 0 && <NoResults />}
    </>
  );
};

export default Install;

const InstallRedirect = (keys: string[], data: any) => {
  let header: any[] = [];
  let body: any[] = [];

  return keys.map((item: string, _index: number) => {
    header = [];
    body = [];

    const connectors: Connector[] = data[item];

    if (connectors) {
      body = connectors.map((connector: Connector, index: number) => {
        return (
              <Typography variant={'h5'} component={'h2'} key={index}>
                {connector.display_name}
              </Typography>
        );
      });
    }
    return [header, body];
  });
};
