import { ReactNode } from 'react';

type AccessToken = string | null | undefined;

type AuthProps = {
  children?: ReactNode;
};

export type { AccessToken, AuthProps };
