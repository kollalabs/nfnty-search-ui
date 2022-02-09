import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';

import CheckError from '../../components/common/ErrorCheck';
import useApiQuery from '../../hooks/ApiQuery';
import useAuthCheck from '../../hooks/AuthCheck';
import useDocumentTitle from '../../hooks/DocumentTitle';
import { Connector } from '../../models/DataModels';
import { handleExternal } from '../../utils/Events';

const InstallRedirect = ({
  connectorKeys,
  connectorData,
}: {
  connectorKeys: string[];
  connectorData: any;
}): JSX.Element => {
  if (connectorKeys.length === 0) {
    return <Typography variant="h5">No connectors found</Typography>;
  }

  const connectorOutput = connectorKeys.map((item: string) => {
    const connectors: Connector[] = connectorData[item];

    if (connectors) {
      return connectors.map((connector: Connector, index: number) => {
        return (
          <Box key={index}>
            <Typography variant={'h5'} component={'h2'} key={index}>
              {connector.display_name}
            </Typography>
            <Button onClick={() => handleExternal(connector?.install_url)}>{'Install'}</Button>
          </Box>
        );
      });
    } else {
      return (
        <Typography variant={'h5'} component={'h2'}>
          {'No connectors found'}
        </Typography>
      );
    }
  });

  return <>{connectorOutput}</>;
};

const Install = () => {
  let connectors: string[] = [];
  let connectorTarget: Connector | undefined = undefined;
  useDocumentTitle('Install Connector');
  const search = useLocation().search;
  const target = new URLSearchParams(search).get('target');
  useAuthCheck('/install' + search);

  const connectorsQuery = useApiQuery<any>(['connectors'], 'connectors', {
    method: 'GET',
  });

  if (target && connectorsQuery.data) {
    connectorTarget = connectorsQuery.data['connectors'].find((c: Connector) => c.name === target);

    if (connectorTarget && connectorTarget.install_url) {
      window.location.href = connectorTarget.install_url;
    }
  } else {
    if (connectorsQuery.data && connectorsQuery.data['connectors']) {
      connectors = Object.keys(connectorsQuery.data);
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
      {connectors.length > 0 && (
        <InstallRedirect connectorKeys={connectors} connectorData={connectorsQuery.data} />
      )}
    </>
  );
};

export default Install;
