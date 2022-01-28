// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
import React from 'react';
import useAuthCheck from '../../hooks/AuthCheck';
// import Typography from '@mui/material/Typography';

const Connections = () => {
  useAuthCheck('/connections');

  return (
    <>
      <Card raised sx={{ p: 1, m: 1 }}>
        <Typography variant={'h6'}>Add more connections</Typography>
        <Button key={'0'}>View Connections</Button>
      </Card>
    </>
  );
};

export default Connections;
