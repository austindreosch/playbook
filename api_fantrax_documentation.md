# Fantrax API Documentation
## v1 (Beta)

### Introduction
The Fantrax REST API provides access to data pertaining to the fantasy leagues on Fantrax. The API has been built, and will continue to be built based on users’ needs. This is a draft document that has basic usage information. A more complete document will be available in the future.

### API Usage
#### General
This is a REST API – requests are made using simple HTTP requests, and all responses are in JSON format. To send extra request data beyond the URL, you can enter them as simple HTTP parameters in a Query String, or you can use JSON in the body of a POST request. For example, here is the same request, resulting in the same response, using each format:

1) Query String: https://www.fantrax.com/fxea/general/getAdp?sport=MLB  
2) POST request: https://www.fantrax.com/fxea/general/getAdp  
   Request body: {"sport":"NFL"}

#### Retrieve Player IDs
This is used to retrieve the Fantrax IDs that identify every Player. All other API calls use these IDs to refer to players.

- URL: https://www.fantrax.com/fxea/general/getPlayerIds?sport=NFL  
- Request Parameters: None

#### Retrieve Player Info
This is used to retrieve ADP (Average Draft Pick) info for all players in the specified sport, with optional filters.

- URL: https://www.fantrax.com/fxea/general/getAdp  
- Request Parameters:
  - sport (required) – one of NFL, MLB, NHL, NBA, NCAAF, NCAAB, PGA, NASCAR, EPL
  - position (optional) – standard position abbreviations (e.g. QB, WR for football)
  - showAllPositions – whether to show default position, or all Fantrax positions of player. Can be “true” or “false”
  - start
  - limit
  - order – the order of the players returned. Can be “Name” or “ADP”; will default to ADP
- Request Body Examples:
  - {"sport":"NFL"}
  - {"sport":"NFL","position":"QB","start":1,"limit":5,"order":"NAME"}
  - or for a simple full-sport query, can issue this, e.g.: https://www.fantrax.com/fxea/general/getAdp?sport=NFL

#### Retrieve League List
Retrieve the list of leagues, including name and ID of each league, as well as the name(s) and ID(s) that the user owns in each league.

- URL: https://www.fantrax.com/fxea/general/getLeagues  
- Request Parameters:
  - userSecretId (required) – This is the Secret ID shown on the Fantrax User Profile screen
- Request Body Examples:
  - {"userSecretId":"24pscnquxwekzngy"}
  - or, can use query string, e.g.: https://www.fantrax.com/fxea/general/getLeagues?userSecretId=24pscnquxwekzngy

#### Retrieve League Info
Retrieve information about a specific league. This includes all the team names/IDs, matchups, players in pool with info, and many of the league configuration settings.

- URL: https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=[League ID]  
- Request Parameters: None

#### Retrieve Draft Results
Retrieve the draft results of a specific league. This can be retrieved live during a draft.

- URL: https://www.fantrax.com/fxea/general/getDraftResults?leagueId=[League ID]  
- Request Parameters: None

#### Retrieve Team Rosters
Retrieve data on all rosters, including salary and contract data if your league uses it, as well as all players on the rosters, their statuses, positions. This is retrieved for the upcoming/current period that is not yet locked from lineups.

- URL: https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=[League ID]  
- Request Parameters: None

#### Retrieve League Standings
Retrieve the current standings of the league. This includes basic standings data, such as the rank, points, W-L-T, games back, win %, etc. Individual stats are not yet included, but will be in a future release.

- URL: https://www.fantrax.com/fxea/general/getStandings?leagueId=[League ID]  
- Request Parameters: None