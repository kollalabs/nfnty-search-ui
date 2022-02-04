import { ReactNode } from 'react';

type Token = string | null | undefined;

type AuthProps = {
  children?: ReactNode;
};

export type { Token, AuthProps };
