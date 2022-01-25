import Container from '@mui/material/Container';
import React from 'react';
import { CircularProgress } from '@mui/material';

const FullScreenLoader = () => {
  return (
    <Container maxWidth={'xl'}>
      <CircularProgress />
    </Container>
  );
};

export default FullScreenLoader;
