import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Connector } from '../../models/DataModels';
import { handleExternal } from '../../utils/Events';

const ConnectorItems = (keys: string[], data: any) => {
  let header: any[] = [];
  let body: any[] = [];

  // if (!data) {
  //   return <
  // }
  return keys.map((item: string, index: number) => {
    header = [];
    body = [];

    const connectors: Connector[] = data[item];

    if (connectors) {
      body = connectors.map((connector: Connector, index: number) => {
        return (
          <Card
            key={index}
            elevation={5}
            raised
            sx={{
              borderRadius: '16px',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 2,
              p: 2,
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() =>
              handleExternal(
                'https://jobnimbus.kolla.market/apps/wuv6u4oesbdalgoygino2k2hjm/landing'
              )
            }
          >
            {connector.connected && (
              <>
                <Tooltip
                  title={
                    <React.Fragment>
                      <Typography color="inherit">Connected</Typography>
                      {'Yay! This connector ready to go.'}
                    </React.Fragment>
                  }
                >
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                      color: 'green',
                    }}
                  />
                </Tooltip>
              </>
            )}
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar src={connector.logo} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
              <Typography variant={'h5'} component={'h2'}>
                {connector.display_name}
              </Typography>
            </CardContent>
          </Card>
        );
      });
    }
    return [header, body];
  });
};

export { ConnectorItems };
