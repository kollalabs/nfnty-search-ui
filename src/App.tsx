import CssBaseline from '@mui/material/CssBaseline';
import FullScreenLoader from './components/layout/FSLoader';
import React from 'react';
import { Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';

import RoutesMap from './routing/RoutesMap';
import useColorMode from './contexts/ColorModeContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const [theme] = useColorMode();
  const token = localStorage.getItem('user');
  const { isLoading, error } = useAuth0();

  if (isLoading) return <FullScreenLoader />;
  if (error) return <Alert severity="error">Oops... {error.message}</Alert>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider token={token}>
        <RoutesMap />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
