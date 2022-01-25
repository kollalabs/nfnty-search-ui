import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import { DefaultProps } from '../../../models/PropModels';

const Footer = (props: DefaultProps) => {
  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>{props.children}</Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;
