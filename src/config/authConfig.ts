const authConfig: any = {
  audience: 'https://infinitysearch.xyz',
  clientId: '2feXxLBCFHqtoNA05PdcrI3aqVsXbvu4',
  // domain: 'auth.infinitysearch.xyz',
  scope: 'openid profile email',
  domain: 'infinitysearch.us.auth0.com',
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
  redirectUri: `${window.location.origin}/auth-callback`,
};

export { authConfig };
