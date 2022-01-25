import React from 'react';
import { useLocation } from 'react-router-dom';

import HeaderUserMenu from './HeaderUserMenu';
import ResponsiveAppBar from '../ResponsiveMenuBar';

const HeaderNavMenu = () => {
  let location = useLocation();
  console.log('location:', location);
  return (
    <>
      <ResponsiveAppBar showLogo={true} />
      <HeaderUserMenu />
    </>
  );
};

export default HeaderNavMenu;
