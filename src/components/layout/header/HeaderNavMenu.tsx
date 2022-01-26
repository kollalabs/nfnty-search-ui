import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';

import HeaderUserMenu from './HeaderUserMenu';
import ResponsiveAppBar from '../ResponsiveMenuBar';

const HeaderNavMenu = () => {
  const { isAuthenticated } = useAuth0();

  let location = useLocation();
  console.log('location:', location);
  return (
    <>
      <ResponsiveAppBar showLogo={true} />
      {isAuthenticated && <HeaderUserMenu />}
    </>
  );
};

export default HeaderNavMenu;
