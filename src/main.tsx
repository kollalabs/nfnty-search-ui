import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { authConfig } from './config/authConfig';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authConfig.domain}
      clientId="2feXxLBCFHqtoNA05PdcrI3aqVsXbvu4"
      audience={`${authConfig.audience}`}
      scope={authConfig.scope}
      redirectUri={`${window.location.origin}/auth-callback`}
      useRefreshTokens={true}
      cacheLocation={'localstorage'}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
