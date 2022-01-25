import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import NavLogo from './header/NavLogo';
import React, { useState } from 'react';
import { MenuLink } from '../../models/LayoutModels';
import { Link as RouterLink } from 'react-router-dom';
import { StyleProps } from '../../models/PropModels';

type MenuBarProps = {
  showLogo: boolean;
  menuItems?: MenuLink[];
} & StyleProps;

const ResponsiveAppBar = ({
  sx = [],
  showLogo = true,
  menuItems = [],
}: MenuBarProps) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      {showLogo && <NavLogo narrow={false} />}
      <Box
        sx={[
          { flexGrow: 1, display: { xs: 'flex', md: 'none' } },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {menuItems.length > 0 && (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        )}
        {menuItems.length > 0 && (
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {menuItems.map((link: MenuLink, index: number) => (
              <MenuItem key={index}>
                <Typography textAlign="center">
                  <RouterLink to={link.url}>{link.displayName}</RouterLink>
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>
      {showLogo && <NavLogo narrow={true} />}
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {menuItems.map((link: MenuLink, index: number) => (
          <Button
            key={index}
            component={RouterLink}
            to={link.url}
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {link.displayName}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default ResponsiveAppBar;
