import Button from '@mui/material/Button';
import React from 'react';
import { authConfig } from '../../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant={'contained'}
      onClick={() => loginWithRedirect({ scope: authConfig.scope })}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
