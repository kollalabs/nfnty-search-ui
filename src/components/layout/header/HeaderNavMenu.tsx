import React from 'react';

import HeaderUserMenu from './HeaderUserMenu';
import ResponsiveAppBar from '../ResponsiveMenuBar';

const HeaderNavMenu = () => {
  return (
    <>
      <ResponsiveAppBar showLogo={true} />
      <HeaderUserMenu />
    </>
  );
};

export default HeaderNavMenu;
