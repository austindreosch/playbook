/**
 * Retrieves comprehensive league data for a given league from the Fantrax API.
 *
 * @param {string} leagueId - The unique identifier of the individual league.
 * @returns {Promise<Object|null>} A Promise that resolves to an object containing the processed league data, structured as follows:
 * 
 * {
 *   leagueId: string,
 *   teamId: string,
 *   userTeamId: string,
 *   userTeamName: string,
 *   teams: [
 *     {
 *       teamId: string,
 *       teamName: string,
 *       players: [
 *         {
 *           fantraxId: string,
 *           name: string,
 *           position: string,
 *           team: string,
 *           rotowireId: number,
 *         }
 *       ]
 *     }
 *   ]
 * }
 * 
 * The structure represents league information, including each team's players and a list of waiver players.
 * 
 * @throws {Error} If there is an error during the data retrieval or processing.
 */

import axios from 'axios';

//----------------------------------------------------------------
// COLLECTION OF METHODS FOR FETCHING LEAGUE DATA FROM FANTRAX API
//----------------------------------------------------------------

/* -------------------------------------------------------------------------------------------------------------------------
  Grab all the data for a league, including the league name, league settings, the team names, and the players on each team
------------------------------------------------------------------------------------------------------------------------- */
export const getLeagueData = async (uniqueLeagueId, providerLeagueId, userTeamId, userAuthId, leagueName, leagueProvider, leagueFormat, leagueSport, leagueScoring ) => {
  const retrieveRostersURL = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${providerLeagueId}`;
  const playerDataURL = "https://www.fantrax.com/fxea/general/getPlayerIds?sport=NBA";
  
  try {
    const [rostersResponse, playerDataResponse] = await Promise.all([
      axios.get(retrieveRostersURL),
      axios.get(playerDataURL)
    ]);

    const rostersData = rostersResponse.data.rosters;
    const playerDataMap = playerDataResponse.data;

    const leagueData = {
      uniqueLeagueId: uniqueLeagueId,
      userAuthId: userAuthId,
      userTeamId: userTeamId,
      providerLeagueId: providerLeagueId,
      leagueProvider: leagueProvider,
      leagueName: leagueName,
      leagueSport: leagueSport,
      leagueFormat: leagueFormat,
      leagueScoring: leagueScoring,
      leagueInfo: {},
      teams: []
    };

    leagueData.leagueInfo = await getLeagueInfo(providerLeagueId);

    for (let teamId in rostersData) {
      if (rostersData.hasOwnProperty(teamId)) {
        const teamData = rostersData[teamId];
        const players = [];

        if (Array.isArray(teamData.rosterItems)) {
          teamData.rosterItems.forEach(item => {
            const playerData = playerDataMap[item.id];
            if (playerData) {
              const cleanedName = playerData.name.split(', ').reverse().join(' ');
              players.push({
                fantraxId: playerData.fantraxId,
                name: cleanedName,
                position: playerData.position,
                team: playerData.team,
                rotowireId: playerData.rotowireId,
              });
            }
          });
        }

        leagueData.teams.push({
          teamId: teamId,
          teamName: teamData.teamName,
          players: players
        });
      }
    }

    return leagueData;

  } catch (error) {
    console.error("Error fetching and processing league data:", error);
    throw error;
  }
};

/* ---------------------------------------------------------------------------------------------------------
  Get roster size and active roster size, scoring system, and team composition rules for a given league
---------------------------------------------------------------------------------------------------------- */
export const getLeagueInfo = async (leagueId) => {
  const leagueInfoUrl = `https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=${leagueId}`
  
  try {
    const leagueInfoResponse = await axios.get(leagueInfoUrl);
    const leagueInfoData = leagueInfoResponse.data;

    const positionConstraints = leagueInfoData.rosterInfo.positionConstraints;
    const positionArray = generatePositionArray(positionConstraints);

    const leagueInfo = {
      activeRosterSize: leagueInfoData.rosterInfo.maxTotalActivePlayers,
      totalRosterSize: leagueInfoData.rosterInfo.maxTotalPlayers,
      positionArray: positionArray
    };

    return leagueInfo;

  } catch (error) {
    console.error("Error fetching waiver player data:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------------------
  Helper function to generate team composition rules array for getLeagueInfo() method
----------------------------------------------------------------------------------------- */
const generatePositionArray = (positionConstraints) => {
  const positionArray = [];
  
  for (const position in positionConstraints) {
    const maxActive = positionConstraints[position].maxActive;
    
    for (let i = 0; i < maxActive; i++) {
      positionArray.push(position);
    }
  }
  
  return positionArray;
};


/* -------------------------------------------------------------------------------------------------------------------
  Access Fantrax API to get the league data for import page, using the leagueId and leagueName input in the form
-------------------------------------------------------------------------------------------------------------------- */
export const getLeagueDataForImport = async (leagueId, leagueName, provider) => {
  const retrieveRostersURL = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueId}`;

  try {
    const rostersResponse = await axios.get(retrieveRostersURL);
    const rostersData = rostersResponse.data.rosters; // Adjusted to access the 'rosters' property

    const leagueData = {
      provider: provider,
      leagueId: leagueId,
      leagueName: leagueName,
      leagueTeamCount: Object.keys(rostersData).length,
      teams: []
    };

    for (let teamId in rostersData) {
      if (rostersData.hasOwnProperty(teamId)) {
        const teamData = rostersData[teamId];
        leagueData.teams.push({
          teamId: teamId,
          teamName: teamData.teamName,
          rosterItems: teamData.rosterItems.map(item => ({ 
            id: item.id, 
            position: item.position, 
            status: item.status 
          }))
        });
      }
    }

    return leagueData;

  } catch (error) {
    console.error("Error fetching and processing league data:", error);
    throw error;
  }
};


