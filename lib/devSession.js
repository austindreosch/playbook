// Development session bypass for visual editors like Piny
// This allows you to work with authenticated components during visual editing

export const mockUser = {
  sub: 'google-oauth2|102929654174322648188',
  email: 'dev@example.com',
  name: 'Dev User',
  picture: 'https://via.placeholder.com/50',
  email_verified: true
};

export const mockDevSession = {
  user: mockUser,
  accessToken: 'mock-access-token',
  accessTokenExpiresAt: Date.now() + 3600000, // 1 hour from now
  accessTokenScope: 'openid profile email'
};

export const shouldBypassAuth = () => {
  return process.env.BYPASS_AUTH_FOR_VISUAL_EDITOR === 'true' && 
         (process.env.NODE_ENV === 'development');
};