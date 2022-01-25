import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import RoutesStatic from './routing/RoutesStatic';
import { authConfig } from './config/auth';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authConfig.domain}
      clientId="2feXxLBCFHqtoNA05PdcrI3aqVsXbvu4"
      audience={`https://${authConfig.domain}/api/v2/`}
      scope={authConfig.scope}
      redirectUri={`${window.location.origin}/auth-callback`}
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
    <RoutesStatic />
  </React.StrictMode>,
  document.getElementById('root')
);
