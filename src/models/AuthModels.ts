import { ReactNode } from 'react';

type Token = string | null | undefined;

type AuthProps = {
  token: Token;
  children?: ReactNode;
};

export type { Token, AuthProps };
