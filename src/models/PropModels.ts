import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

type DefaultProps = {
  children: ReactNode;
};

type StyleProps = {
  sx?: SxProps<Theme>;
};

export type { DefaultProps, StyleProps };
