import React, { createContext, useEffect, useState } from 'react';
import { AccessToken, AuthProps } from '../models/AuthModels';
import { authConfig } from '../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext<AccessToken>(null as AccessToken);

function AuthProvider(props: AuthProps) {
  const [token, setToken] = useState(null as AccessToken);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently({
        audience: authConfig.audience,
        scope: authConfig.scope,
      });
      setToken(accessToken);
    })();
  }, [token]);

  return <AuthContext.Provider value={token} {...props} />;
}

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
