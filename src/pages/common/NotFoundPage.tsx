import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/start.html' || location.pathname === '/') {
      window.location.href = `${window.location.origin}/start.html`;
    }
  });

  return (
    <>
      <Typography variant={'body1'}>Whoa, where did you come from?</Typography>
      <Link to={'/'}>Go Home</Link>
    </>
  );
};

export default NotFoundPage;
