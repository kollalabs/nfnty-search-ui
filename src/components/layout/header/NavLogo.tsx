import Box from '@mui/material/Box';
import React from 'react';
import imgUrl from '../../../static/images/infinity-search-logo-trimmed.png'; // this needs to be dynamic
import { Link } from 'react-router-dom';

const NavLogo = ({ narrow }: any) => {
  const sx = narrow
    ? { flexGrow: 1, display: { xs: 'flex', md: 'none' } }
    : { mr: 2, display: { xs: 'none', md: 'flex' } };

  return (
    <Box sx={sx}>
      <Link to={'/apps'}>
        <img src={imgUrl} style={{ maxWidth: '100%', height: '3rem' }} />
      </Link>
    </Box>
  );
};

export default NavLogo;
