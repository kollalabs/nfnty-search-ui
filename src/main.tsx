import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { authConfig } from './config/authConfig';

const providerConfig = {
  ...authConfig,
  // add additional configuration options here if needed
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig} >
      <AuthProvider>
        <App />
      </AuthProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
