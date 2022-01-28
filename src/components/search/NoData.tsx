import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import React from 'react';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

const NoData = (
  <>
    <Alert key={0} severity={'info'} sx={{ m: 2 }}>
      No data found
    </Alert>
    <Card raised sx={{ p: 1, m: 1 }}>
      <Typography variant={'h6'}>Add more connections</Typography>
      <Button key={'0'} component={RouterLink} to={'/connections'}>
        View Connections
      </Button>
    </Card>
  </>
);
const PreSearch = <>Hey, start searching!</>;
export { NoData, PreSearch };
