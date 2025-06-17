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

  if (!response.ok || !data.access_token) {
    console.error('Auth0 Token Error:', data);
    throw new Error('Could not obtain an Auth0 management token.');
  }

  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { sub: userId } = session.user;
    const mgmtToken = await getManagementApiToken();

    const verificationResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/verification-email`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${mgmtToken}`,
      },
      body: JSON.stringify({
        user_id: userId,
        // client_id is optional but good practice if you have its value
        ...(process.env.AUTH0_CLIENT_ID && { client_id: process.env.AUTH0_CLIENT_ID }),
      }),
    });

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json();
      // Log the detailed error from Auth0
      console.error('Auth0 API Job Error:', errorData);
      // Send a more specific error back to the client
      return res.status(verificationResponse.status).json({ message: `Failed to resend email: ${errorData.message}`, details: errorData });
    }

    return res.status(200).json({ success: true, message: 'Verification email sent successfully.' });
  } catch (error) {
    // Log the caught error for debugging
    console.error('Resend Verification Server Error:', error);
    return res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
} 