const authConfig: any = {
  audience: 'https://infinitysearch.xyz',
  cacheLocation: 'localstorage',
  clientId: '2feXxLBCFHqtoNA05PdcrI3aqVsXbvu4',
  domain: 'infinitysearch.us.auth0.com',
  redirectUri: `${window.location.origin}/auth-callback`,
  scope: 'openid profile email',
  useRefreshTokens: true,
};

export { authConfig };
