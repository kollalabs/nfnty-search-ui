import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import Typography from '@mui/material/Typography';
import { Connector } from '../../models/DataModels';

const ConnectionItems = (keys: string[], data: any) => {
  let header: any[] = [];
  let body: any[] = [];

  return keys.map((item: string, index: number) => {
    header = [];
    body = [];

    const connectors: Connector[] = data[item];

    if (connectors) {
      body = connectors.map((connector: Connector, index: number) => {
        return (
          <Card
            key={index}
            sx={{
              minWidth: 275,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 2,
            }}
          >
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

export { ConnectionItems };
