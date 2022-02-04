import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthCallback from './auth/AuthCallback';
import Connections from '../pages/connections/Connections';
import Footer from './layout/footer/Footer';
import FooterNavMenu from './layout/footer/FooterNavMenu';
import Header from './layout/header/Header';
import HeaderNavMenu from './layout/header/HeaderNavMenu';
import Login from '../pages/auth/Login';
import Logout from '../pages/auth/Logout';
import NotFoundPage from '../pages/common/NotFoundPage';
import RequireAuth from './auth/RequireAuth';
import Search from '../pages/search/Search';
import { AppSearchProvider } from '../contexts/SearchContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppLayout = () => {
  return (
    <Container disableGutters>
      <QueryClientProvider client={queryClient}>
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
                path={'/connectors'}
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
          <ToastContainer limit={3} />
        </AppSearchProvider>
      </QueryClientProvider>
    </Container>
  );
};

export default AppLayout;
