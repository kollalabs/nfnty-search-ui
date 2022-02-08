import CssBaseline from '@mui/material/CssBaseline';
import FullScreenLoader from './components/layout/FSLoader';
import React from 'react';
import { Alert } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';

import RoutesMap from './routing/RoutesMap';
import useColorMode from './contexts/ColorModeContext';

const App: React.FC = () => {
  const [theme] = useColorMode();
  const { isLoading, error } = useAuth0();

  if (isLoading) return <FullScreenLoader />;
  if (error) {
    if (error?.message && error.message.toLocaleLowerCase() === 'invalid state') {
      window.location.href = '/';
    }
    return <Alert severity="error">Oops... {error.message}</Alert>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoutesMap />
    </ThemeProvider>
  );
};

export default App;
