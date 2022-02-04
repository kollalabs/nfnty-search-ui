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
        <Skeleton animation="wave" variant="circular" width={70} height={70} sx={{ mr: 2 }} />
        <Skeleton animation="wave" height={50} width="20%" style={{ marginBottom: 0 }} />
      </Box>
      <Skeleton animation="wave" height={50} width="80%" style={{ marginBottom: 0 }} />
      <Skeleton animation="wave" height={50} width="75%" style={{ marginBottom: 0 }} />
      <Skeleton animation="wave" height={50} width="70%" style={{ marginBottom: 0 }} />
      <Skeleton animation="wave" height={50} width="77%" style={{ marginBottom: 8 }} />
    </>
  );
}

export default SearchSkeleton;
