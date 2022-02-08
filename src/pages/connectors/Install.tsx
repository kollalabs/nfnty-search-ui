import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

import CheckError from '../../components/common/ErrorCheck';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Connector } from '../../models/DataModels';

const Install = () => {
  let connectors: string[] = [];
  let connectorTarget: Connector | undefined = undefined;
  useDocumentTitle('Install Connector');
  const search = useLocation().search;
  const target = new URLSearchParams(search).get('target');
  useAuthCheck('/install' + search);

  const connectorsQuery = useApiQuery<any>(
    ['connectors'],
    'connectors',
    {
      method: 'GET',
    },
    {
      enabled: Boolean(target && target.length > 0),
    }
  );

  if (!target) {
    return <CheckError message="No target specified" />;
  }

  if (connectorsQuery.data && connectorsQuery.data['connectors']) {
    connectorTarget = connectorsQuery.data['connectors'].find((c: Connector) => c.name === target);

    if (connectorTarget && connectorTarget.install_url) {
      window.location.href = connectorTarget.install_url;
    }
  }

  return (
    <>
      <Typography align={'center'} variant={'h3'} gutterBottom>
        Install Connector
      </Typography>
      {connectorTarget && connectorTarget.install_url.length === 0 && (
        <CheckError message="No install url found" />
      )}
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
