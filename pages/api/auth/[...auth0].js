import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export default handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Force opening login in a new window for visual editors
      display: 'popup'
    }
  }),
  callback: handleCallback({
    onError(req, res, error) {
      console.error('Callback Error:', error);
      console.error('Request URL:', req.url);
      console.error('Request headers host:', req.headers.host);
      res.status(error.status || 500).end(error.message);
    }
  }),
  onError(req, res, error) {
    console.error('Auth0 Error:', error);
    console.error('Request URL:', req.url);
    console.error('Request headers host:', req.headers.host);
    res.status(error.status || 500).end(error.message);
  }
});