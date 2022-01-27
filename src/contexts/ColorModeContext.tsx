import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';

const useColorMode = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
        },
      }),
    []
  );

  return [theme] as const;
};

export default useColorMode;
