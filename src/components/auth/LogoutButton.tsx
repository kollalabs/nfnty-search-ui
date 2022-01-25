import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
  return (
    <Button variant={'contained'}>
      <Link
        to={'/logout'}
        style={{ textDecoration: 'inherit', color: 'inherit' }}
      >
        Log Out
      </Link>
    </Button>
  );
};

export default LogoutButton;
