import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import React from 'react';
import Search from '../../search/Search';
import Toolbar from '@mui/material/Toolbar';
import { DefaultProps } from '../../../models/PropModels';

const Header = (props: DefaultProps) => {
  return (
    <AppBar position="static">
      <Container maxWidth={'xl'} sx={{ pb: 3 }}>
        <Toolbar disableGutters>{props.children}</Toolbar>
        <Search />
      </Container>
    </AppBar>
  );
};

export default Header;
