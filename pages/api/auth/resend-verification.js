import { getSession } from '@auth0/nextjs-auth0';

async function getManagementApiToken() {
  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    }),
  });
  const data = await response.json();
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { sub: userId } = session.user;

  try {
    const mgmtToken = await getManagementApiToken();
    if (!mgmtToken) {
      return res.status(500).json({ error: 'Failed to get management API token.' });
    }

    const verificationResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/verification-email`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${mgmtToken}`,
      },
      body: JSON.stringify({
        user_id: userId,
        client_id: process.env.AUTH0_CLIENT_ID,
      }),
    });

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json();
      console.error('Auth0 API Error:', errorData);
      return res.status(verificationResponse.status).json({ error: 'Failed to resend verification email.', details: errorData });
    }

    return res.status(200).json({ success: true, message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
} 