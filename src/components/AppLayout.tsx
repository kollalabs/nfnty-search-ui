import AuthCallback from './auth/AuthCallback';
import Connections from '../pages/connections/Connections';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Logout from '../pages/auth/Logout';
import React from 'react';
import { AppSearchProvider } from '../contexts/SearchContext';

import Footer from './layout/footer/Footer';
import FooterNavMenu from './layout/footer/FooterNavMenu';
import Header from './layout/header/Header';
import HeaderNavMenu from './layout/header/HeaderNavMenu';
import Login from '../pages/auth/Login';
import NotFoundPage from '../pages/common/NotFoundPage';
import RequireAuth from './auth/RequireAuth';
import Search from '../pages/search/Search';
import { Route, Routes } from 'react-router-dom';

const AppLayout = () => {
  return (
    <Container disableGutters>
      <AppSearchProvider>
        <Header>
          <HeaderNavMenu />
        </Header>
        <Grid item xs={12} sx={{ p: 2 }}>
          <Routes>
            <Route path={'*'} element={<NotFoundPage />} />
            <Route path={'/auth-callback'} element={<AuthCallback />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/logout'} element={<Logout />} />
            <Route
              path={'/search'}
              element={
                <RequireAuth>
                  <Search />
                </RequireAuth>
              }
            />
            <Route
              path={'/connections'}
              element={
                <RequireAuth>
                  <Connections />
                </RequireAuth>
              }
            />
          </Routes>
        </Grid>
        <Footer>
          <FooterNavMenu />
        </Footer>
      </AppSearchProvider>
    </Container>
  );
};

export default AppLayout;
