import { connectToDatabase } from '@/lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

/* -----------------------------------------------------------
    Enhanced endpoint to save imported league data in MongoDB
    with new schema supporting multi-platform imports
----------------------------------------------------------- */

const handler = async (req, res) => {
  try {
    const { client, db } = await connectToDatabase();
    const leaguesCollection = db.collection('leagues');

    if (req.method === 'GET') {
      // Get leagues for current user
      const session = await getSession(req, res);
      if (!session?.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const leagues = await leaguesCollection
        .find({ userId: session.user.sub })
        .sort({ createdAt: -1 })
        .toArray();
      
      res.status(200).json(leagues);
    } 
    else if (req.method === 'POST') {
      // Save new league import
      const session = await getSession(req, res);
      if (!session?.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const leagueData = req.body;
      
      // Validate required fields
      const requiredFields = ['sport', 'leagueType', 'scoring', 'matchup', 'draftType'];
      for (const field of requiredFields) {
        if (!leagueData[field]) {
          return res.status(400).json({ error: `${field} is required` });
        }
      }

      // Create standardized league document
      const league = {
        // User and platform info
        userId: session.user.sub,
        platform: leagueData.platform || 'fantrax',
        platformLeagueId: leagueData.platformLeagueId || leagueData.leagueId,
        
        // Basic league info
        leagueName: leagueData.leagueName || 'Imported League',
        teamCount: leagueData.teamCount || 0,
        
        // Core classifications (new schema)
        sport: leagueData.sport,
        leagueType: leagueData.leagueType, // 'Redraft', 'Dynasty', 'Keeper'
        scoring: leagueData.scoring, // 'Points', 'Categories'
        matchup: leagueData.matchup, // 'H2H', 'Roto', 'Total Points'
        draftType: leagueData.draftType, // 'Snake', 'Auction'
        
        // Legacy fields for backward compatibility
        dynasty: leagueData.leagueType === 'Dynasty',
        
        // Advanced settings from conditional prompts
        settings: {
          decay: leagueData.settings?.decay || false,
          contracts: leagueData.settings?.contracts || false,
          playoffSchedule: leagueData.settings?.playoffSchedule || null,
          gamesLimit: leagueData.settings?.gamesLimit || null,
          teamDirection: leagueData.settings?.teamDirection || null,
          categories: leagueData.settings?.categories || [],
          mostCategories: leagueData.settings?.mostCategories || false,
          puntCategories: leagueData.settings?.puntCategories || [],
          
          // Platform-specific settings
          rosterPositions: leagueData.settings?.rosterPositions || [],
          tradingEnabled: leagueData.settings?.tradingEnabled || true,
          waiverType: leagueData.settings?.waiverType || 'FAAB'
        },
        
        // Team and roster data
        teams: leagueData.teams || [],
        rosters: leagueData.rosters || [],
        
        // Metadata
        createdAt: new Date(),
        updatedAt: new Date(),
        importedAt: new Date()
      };

      const result = await leaguesCollection.insertOne(league);

      if (result.acknowledged) {
        const savedLeague = await leaguesCollection.findOne({ _id: result.insertedId });
        res.status(201).json(savedLeague);
      } else {
        res.status(500).json({ error: 'Failed to save league' });
      }
    } 
    else if (req.method === 'PUT') {
      // Update existing league
      const session = await getSession(req, res);
      if (!session?.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { leagueId, ...updateData } = req.body;
      
      const result = await leaguesCollection.updateOne(
        { _id: leagueId, userId: session.user.sub },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ error: 'League not found' });
      } else {
        const updatedLeague = await leaguesCollection.findOne({ _id: leagueId });
        res.status(200).json(updatedLeague);
      }
    }
    else if (req.method === 'DELETE') {
      // Delete league
      const session = await getSession(req, res);
      if (!session?.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { leagueId } = req.query;
      
      const result = await leaguesCollection.deleteOne({
        _id: leagueId,
        userId: session.user.sub
      });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'League not found' });
      } else {
        res.status(200).json({ success: true });
      }
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('League import API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
