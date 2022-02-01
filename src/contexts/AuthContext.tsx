import React, { createContext, useEffect, useState } from 'react';
import { AuthProps, Token } from '../models/AuthModels';
import { authConfig } from '../config/authConfig';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext<Token>(null as Token);

function AuthProvider(props: AuthProps) {
  const [token, setToken] = useState(null as Token);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently({
        audience: authConfig.audience,
        scope: authConfig.scope,
      });
      setToken(accessToken);
    })();
  }, []);

  return <AuthContext.Provider value={token} {...props} />;
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
