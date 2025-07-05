import { getCommissionerLeagueData } from '@/utilities/dummyData/CommissionerDummyData';
import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';

export default async function handler(req, res) {
  const { leagueID } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if this is the playbook recruit dummy league
    if (leagueID === 'playbook-recruit-dummy') {
      // Read CSV files directly
      const csvDir = path.join(process.cwd(), 'public', 'docs', 'commissioner');
      
      // Read League Settings CSV
      const settingsCSV = fs.readFileSync(path.join(csvDir, 'PlaybookRecruitDummyDatabase - League Settings.csv'), 'utf8');
      const settingsData = Papa.parse(settingsCSV, { header: true }).data;
      const settings = {};
      settingsData.forEach(row => {
        if (row.Setting && row.Value) {
          settings[row.Setting] = row.Value;
        }
      });
      
      // Read Rulebook CSV
      const rulebookCSV = fs.readFileSync(path.join(csvDir, 'PlaybookRecruitDummyDatabase - Rulebook.csv'), 'utf8');
      const rulebookData = Papa.parse(rulebookCSV, { header: true }).data;
      const rulebook = {};
      rulebookData.forEach(row => {
        if (row.Title && row.Content) {
          rulebook[row.Title] = row.Content;
        }
      });
      
      // Read Players CSV
      const playersCSV = fs.readFileSync(path.join(csvDir, 'PlaybookRecruitDummyDatabase - Players.csv'), 'utf8');
      const playersData = Papa.parse(playersCSV, { header: true }).data;
      
      // Group players by team
      const teamPlayers = {};
      const availableTeams = [];
      const allTeams = [];
      
      playersData.forEach(player => {
        if (player.TeamName && player.PlayerName) {
          if (!teamPlayers[player.TeamName]) {
            teamPlayers[player.TeamName] = [];
          }
          teamPlayers[player.TeamName].push({
            name: player.PlayerName,
            team: player.NBATeam,
            position: player.Position
          });
        }
      });
      
      // Create available teams (Team A, B, C)
      const availableTeamNames = settings.AvailableTeams ? settings.AvailableTeams.split(',').map(t => t.trim()) : [];
      availableTeamNames.forEach(teamName => {
        if (teamPlayers[teamName]) {
          const strengthsKey = `${teamName} Strengths`;
          const teamStrengths = settings[strengthsKey] ? settings[strengthsKey].split(',').map(s => s.trim()) : ['Competitive roster', 'Balanced team'];
          
          const draftPicksKey = `${teamName} Draft Picks`;
          const draftPicks = settings[draftPicksKey] ? settings[draftPicksKey].split(',').map(p => p.trim()).filter(p => p) : [];
          
          availableTeams.push({
            teamId: teamName.toLowerCase().replace(/\s+/g, '-'),
            teamName: teamName,
            currentRoster: teamPlayers[teamName],
            teamStrengths: teamStrengths,
            draftPicks: draftPicks
          });
        }
      });
      
      // Create all teams array
      Object.keys(teamPlayers).forEach(teamName => {
        const strengthsKey = `${teamName} Strengths`;
        const teamStrengths = settings[strengthsKey] ? settings[strengthsKey].split(',').map(s => s.trim()) : ['Competitive roster', 'Balanced team'];
        
        const draftPicksKey = `${teamName} Draft Picks`;
        const draftPicks = settings[draftPicksKey] ? settings[draftPicksKey].split(',').map(p => p.trim()).filter(p => p) : [];
        
        allTeams.push({
          teamId: teamName.toLowerCase().replace(/\s+/g, '-'),
          teamName: teamName,
          ownerName: teamName === 'Team A' || teamName === 'Team B' || teamName === 'Team C' ? 'Available' : 'Owned',
          currentRoster: teamPlayers[teamName],
          teamStrengths: teamStrengths,
          draftPicks: draftPicks,
          record: '0-0',
          standingsPosition: 1
        });
      });
      
      // Build league data object
      const leagueData = {
        leagueId: 'playbook-recruit-dummy',
        leagueName: 'The League',
        sport: settings.Sport || 'NBA',
        format: settings.Format || 'Dynasty',
        scoring: settings.Scoring || 'Categories',
        totalTeams: parseInt(settings.Teams) || 12,
        availableSpots: availableTeams.length,
        description: 'Dynasty format NBA league with true dynasty rules and competitive 9-category H2H scoring.',
        commissioner: {
          name: 'Austin (League Commissioner)',
          email: settings.CommissionerEmail,
          discord: settings.CommissionerDiscord,
          reddit: settings.CommissionerReddit
        },
        settings: {
          platform: settings.Platform,
          entryFee: settings['League Fee'],
          payoutStructure: '1st: $550, 2nd: $275, 3rd: $75',
          advancedPayments: settings['Advanced Payments'],
          discordLink: settings.DiscordLink,
          leagueSafeLink: settings.LeagueSafeLink,
          roster: {
            structure: settings['Roster Structure']
          },
          playoffs: {
            teams: parseInt(settings['Playoff Spots']) || 6
          }
        },
        availableTeams: availableTeams,
        allTeams: allTeams,
        fullRulebook: Object.entries(rulebook).map(([title, content]) => `${title}: ${content}`).join('\n\n'),
        rulebook: rulebook,
        status: 'recruiting',
        created_date: '2025-01-01',
        recruitment_deadline: '2025-02-01'
      };
      
      return res.status(200).json(leagueData);
    }

    // Get league data from original dummy database
    const leagueData = await getCommissionerLeagueData(leagueID);
    
    if (!leagueData) {
      return res.status(404).json({ error: 'League not found' });
    }

    return res.status(200).json(leagueData);
  } catch (error) {
    console.error('Error fetching league data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 