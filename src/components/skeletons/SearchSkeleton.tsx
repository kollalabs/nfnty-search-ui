import Box from '@mui/material/Box';
import React from 'react';
import Skeleton from '@mui/material/Skeleton';

function SearchSkeleton() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton animation="wave" variant="circular" width={55} height={55} sx={{ mr: 2 }} />
        <Skeleton animation="wave" height={50} width="20%" style={{ marginBottom: 0 }} />
      </Box>
      <Skeleton animation="wave" height={50} width="100%" style={{ marginBottom: 0 }} />
      <Skeleton animation="wave" height={50} width="95%" style={{ marginBottom: 0 }} />
      <Skeleton animation="wave" height={50} width="100%" style={{ marginBottom: 0 }} />
    </>
  );
}

export default SearchSkeleton;
