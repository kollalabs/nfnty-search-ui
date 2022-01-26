import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';
import { defaultLinks } from '../../styles/coreStyles';

const LogoutButton = () => {
  return (
    <Button variant={'contained'}>
      <Link to={'/logout'} style={defaultLinks}>
        Log Out
      </Link>
    </Button>
  );
};

export default LogoutButton;
