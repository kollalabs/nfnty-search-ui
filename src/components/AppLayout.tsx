import AuthCallback from './auth/AuthCallback';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Logout from '../pages/auth/Logout';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Dashboard from '../pages/dashboard/Dashboard';
import Footer from './layout/footer/Footer';
import FooterNavMenu from './layout/footer/FooterNavMenu';
import Header from './layout/header/Header';
import HeaderNavMenu from './layout/header/HeaderNavMenu';
import Login from '../pages/auth/Login';
import NotFoundPage from '../pages/common/NotFoundPage';
import RequireAuth from './auth/RequireAuth';

const AppLayout = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Container disableGutters>
      <Header>{isAuthenticated && <HeaderNavMenu />}</Header>
      <Grid item xs={12}>
        <Routes>
          <Route path={'*'} element={<NotFoundPage />} />
          <Route path={'/auth-callback'} element={<AuthCallback />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/logout'} element={<Logout />} />
          <Route
            path={'/apps'}
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </Grid>
      <Footer>
        <FooterNavMenu />
      </Footer>
    </Container>
  );
};

export default AppLayout;
