import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';
import { shouldBypassAuth, mockDevSession } from '../../../lib/devSession';

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
  // Override for development bypass
  me: async (req, res) => {
    if (shouldBypassAuth()) {
      console.log('Using development auth bypass for visual editor');
      return res.json(mockDevSession.user);
    }
    // Fall back to default behavior
    const { handleProfile } = await import('@auth0/nextjs-auth0');
    return handleProfile()(req, res);
  },
  onError(req, res, error) {
    console.error('Auth0 Error:', error);
    console.error('Request URL:', req.url);
    console.error('Request headers host:', req.headers.host);
    res.status(error.status || 500).end(error.message);
  }
});