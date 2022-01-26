import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import {
  MenuLink,
  menuUnauthedLinked,
  menuUserLinks,
} from '../../../models/LayoutModels';
import { resetLinks } from '../../../styles/coreStyles';
import { useAuth0 } from '@auth0/auth0-react';

const HeaderUserMenu = () => {
  let menuItems;
  const { isAuthenticated } = useAuth0();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  if (isAuthenticated) {
    menuItems = menuUserLinks;
  } else {
    menuItems = menuUnauthedLinked;
  }
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="User Profile" src="/favicon.svg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {menuItems.map((link: MenuLink, index: number) => (
          <MenuItem key={index} onClick={handleCloseUserMenu}>
            <Link to={link.url} style={resetLinks}>
              {link.displayName}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default HeaderUserMenu;
