export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    leagueID, 
    firstName, 
    lastName, 
    email, 
    teamName, 
    experience 
  } = req.body;

  // Validate required fields
  if (!leagueID || !firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // TODO: Replace with actual database storage or Google Sheets update
    const joinRequest = {
      id: Date.now().toString(),
      leagueID,
      firstName,
      lastName,
      email,
      teamName,
      experience,
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date().toISOString()
    };

    // TODO: Store join request in database/Google Sheets
    console.log('New join request:', joinRequest);

    // TODO: Send notification to commissioner
    // await sendNotificationToCommissioner(leagueID, joinRequest);

    return res.status(200).json({ 
      success: true, 
      message: 'Join request submitted successfully',
      requestId: joinRequest.id
    });
  } catch (error) {
    console.error('Error processing join request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 