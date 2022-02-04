import CheckError from '../../components/common/ErrorCheck';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Typography from '@mui/material/Typography';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Connector } from '../../models/DataModels';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const Install = () => {
  let connectors: string[] = [];
  useDocumentTitle('Install Connector');
  const token = useAuth();

  const search = useLocation().search;
  const target = new URLSearchParams(search).get('target');

  useAuthCheck('/install' + search);

  const connectorsQuery = useApiQuery<any>(
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

  if (connectorsQuery.data && connectorsQuery.data['connectors']) {
    const connectorTarget = connectorsQuery.data['connectors'].find((c: any) => c.name === target);

    if (connectorTarget && connectorTarget.install_url) {
      window.location.href = connectorTarget.install_url;
    }
  }

  return (
    <>
      <Typography align={'center'} variant={'h3'} gutterBottom>
        Install Connector
      </Typography>
      {connectorsQuery.isFetching && <CircularProgress />}
      {connectorsQuery.error && (
        <CheckError error={connectorsQuery.error} apiRefresh={connectorsQuery.refetch} />
      )}
      {connectors.length > 0 && InstallRedirect(connectors, connectorsQuery.data)}
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
