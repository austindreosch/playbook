# Fantrax API Documentation (v1 Beta)

## Introduction
The Fantrax REST API provides access to data pertaining to the fantasy leagues on Fantrax. The API has been built, and will continue to be built based on users’ needs. This is a draft document that has basic usage information. A more complete document will be available in the future.

## API Usage

### General
This is a REST API – requests are made using simple HTTP requests, and all responses are in JSON format. To send extra request data beyond the URL, you can enter them as simple HTTP parameters in a Query String, or you can use JSON in the body of a POST request. For example, here is the same request, resulting in the same response, using each format:

1.  **Query String**: `https://www.fantrax.com/fxea/general/getAdp?sport=MLB`
2.  **POST request**: `https://www.fantrax.com/fxea/general/getAdp` with request body: `{"sport":"NFL"}`

## Retrieve Player IDs
This is used to retrieve the Fantrax IDs that identify every Player. All other API calls use these IDs to refer to players.

*   **URL**: `https://www.fantrax.com/fxea/general/getPlayerIds?sport=NFL`
*   **Request Parameters**: None

### Response structure
The endpoint returns a single JSON object. Each key in the object is a `fantraxId` (the unique identifier Fantrax uses for a player). The value of each entry is a nested object containing basic identity information for that player:

```json
{
  "002hq": {
    "statsIncId": 8250,
    "name": "Hickok, Marc",
    "fantraxId": "002hq",
    "team": "(N/A)",
    "position": "K"
  },
  "002j2": {
    "statsIncId": 6994,
    "rotowireId": 3076,
    "sportRadarId": "f28cbca1-9c1e-4b90-865a-699bfa386c75",
    "name": "Ward, Derrick",
    "fantraxId": "002j2",
    "team": "(N/A)",
    "position": "RB"
  }
}
```

**Common fields:**
*   `statsIncId` (number) – the Stats Inc. ID used internally by Fantrax to map to official statistics providers.
*   `rotowireId` (number, optional) – Rotowire player ID, when available.
*   `sportRadarId` (string, optional) – SportRadar UUID.
*   `name` (string) – last name and first name, comma‑separated.
*   `fantraxId` (string) – the key and ID used by all other Fantrax endpoints.
*   `team` (string) – the player’s team abbreviation or (N/A) if currently unsigned.
*   `position` (string) – primary position (e.g., QB, RB).

## Retrieve Player Info
This is used to retrieve ADP (Average Draft Pick) info for all players in the specified sport, with optional filters.

*   **URL**: `https://www.fantrax.com/fxea/general/getAdp`
*   **Request Parameters**:
    *   `sport` (required) – one of NFL, MLB, NHL, NBA, NCAAF, NCAAB, PGA, NASCAR, EPL
    *   `position` (optional) – standard position abbreviations (e.g. QB, WR for football)
    *   `showAllPositions` – whether to show default position, or all Fantrax positions of player. Can be “true” or “false”
    *   `start`
    *   `limit`
    *   `order` – the order of the players returned. Can be “Name” or “ADP”; will default to ADP
*   **Request Body Examples**:
    *   `{"sport":"NFL"}`
    *   `{"sport":"NFL","position":"QB","start":1,"limit":5,"order":"NAME"}`
    *   or for a simple full-sport query, can issue this, e.g.: `https://www.fantrax.com/fxea/general/getAdp?sport=NFL`

### Response structure
This call returns a JSON array of player or team objects ordered by the specified sort order (by default ADP). Each entry represents either a player or a defensive team and includes the following fields:

```json
[
  {
    "ADP_PPR": 327.0,
    "pos": "S",
    "name": "Adams, Tony",
    "id": "061gb"
  },
  {
    "ADP_PPR": 1305.2,
    "tmId": "TM_20260",
    "name": "CAR",
    "id": "20260"
  }
]
```

**Field descriptions:**
*   `ADP_PPR` (number) – average draft position for the player in point‑per‑reception formats. Smaller numbers indicate earlier selection. Team defenses or kicker entries will appear with an ADP value as well.
*   `pos` (string, optional) – player’s position. Present only for individual players (e.g., "QB", "WR", "RB"). Team entries omit this field but instead include a `tmId`.
*   `name` (string) – player’s full name (last name, first name) or NFL team abbreviation (e.g., "CAR", "CLE").
*   `id` (string) – Fantrax player ID for individual players or the team numeric identifier for team defenses.
*   `tmId` (string, optional) – Team object ID. Present only when the record represents a team defense or special team entry.

## Retrieve League List
Retrieve the list of leagues, including name and ID of each league, as well as the name(s) and ID(s) that the user owns in each league.

*   **URL**: `https://www.fantrax.com/fxea/general/getLeagues`
*   **Request Parameters**:
    *   `userSecretId` (required) – This is the Secret ID shown on the Fantrax User Profile screen
*   **Request Body Examples**:
    *   `{"userSecretId":"24pscnquxwekzngy"}`
    *   or, can use query string, e.g.: `https://www.fantrax.com/fxea/general/getLeagues?userSecretId=24pscnquxwekzngy`

### Response structure
This endpoint requires a valid `userSecretId` tied to a Fantrax login and therefore cannot be demonstrated here. Based on the API documentation and unofficial client libraries, the response is an array of league objects owned or joined by the user. Each object contains at minimum the league’s name, ID and any franchise IDs that the user controls. A typical record looks like:

```json
[
  {
    "leagueId": "f1zwi0wum3y5041b",
    "leagueName": "Batball Bowl",
    "teamIds": ["gftllinrm83ywd8m"],
    "teamNames": ["Mookie X"],
    "isCommissioner": true
  }
]
```

Where:
*   `leagueId` (string) – unique identifier for the league.
*   `leagueName` (string) – descriptive name displayed in the Fantrax UI.
*   `teamIds` (array of strings) – the franchise IDs for teams the user owns within the league. Multiple values indicate co‑ownership.
*   `teamNames` (array of strings) – names corresponding to `teamIds`.
*   `isCommissioner` (boolean, optional) – indicates whether the user acts as commissioner for the league.

## Retrieve League Info
Retrieve information about a specific league. This includes all the team names/IDs, matchups, players in pool with info, and many of the league configuration settings.

*   **URL**: `https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId=[League ID]`
*   **Request Parameters**: None

### Response structure
The response is a large JSON object summarizing the entire league. Key top‑level fields include:
*   `leagueName` – the displayed name of the league.
*   `draftSettings` – an object describing the draft type (e.g., "snake" or "auction") and other configuration such as draft date and rounds.
*   `matchups` – an array of matchup objects, one per scoring period. Each item contains a period (week number) and a `matchupList` array of head‑to‑head pairings. Each pairing includes an `away` and `home` object with the fields `name`, `id` (franchise ID) and `shortName`.
*   `lineupSettings` – a mapping of positions to the maximum number of active players allowed at that position (e.g., `{"OF": {"maxActive": 5}, "P": {"maxActive": 9}, ...}`) along with totals such as `maxTotalPlayers`, `maxTotalActivePlayers` and `maxTotalReservePlayers`.
*   `playerInfo` – a large dictionary keyed by Fantrax player IDs. Each entry provides the positions at which a player is eligible and their current availability status within the league (e.g., `"eligiblePos": "OF,UT"`, `"status": "WW"` for waiver wire, `"T"` for taken).

Only a portion of the `playerInfo` dictionary is shown below for illustration; the actual response lists every player in the league’s player pool:

```json
{
  "playerInfo": {
    "05295": {
      "eligiblePos": "OF,UT",
      "status": "WW"
    },
    "03nuc": {
      "eligiblePos": "P",
      "status": "T"
    }
  }
}
```
Other fields in the league object include scoring rules, roster and salary cap settings and transaction limits; these vary by sport and league configuration.

## Retrieve Draft Results
Retrieve the draft results of a specific league. This can be retrieved live during a draft.
*   **URL**: `https://www.fantrax.com/fxea/general/getDraftResults?leagueId=[League ID]`
*   **Request Parameters**: None

### Response structure
This endpoint returns a JSON object containing the draft timestamp and an array of picks. A simplified example looks like:

```json
{
  "draftDate": "2025-03-11T23:50:00.0-0400",
  "draftPicks": [
    {
      "round": 5,
      "pick": 55,
      "teamId": "gftllinrm83ywd8m",
      "time": 1741876526000,
      "pickInRound": 7,
      "playerId": "01cgo"
    },
    {
      "round": 1,
      "pick": 5,
      "teamId": "prt6uy5cm84p5yrv",
      "time": 1741773081000,
      "pickInRound": 5,
      "playerId": "01ub6"
    }
  ]
}
```

**Fields per pick:**
*   `round` (integer) – draft round.
*   `pick` (integer) – overall pick number.
*   `teamId` (string) – franchise ID for the drafting team.
*   `time` (number) – milliseconds since epoch representing when the pick was made.
*   `pickInRound` (integer) – pick number within the round.
*   `playerId` (string) – Fantrax player ID of the drafted player.

## Retrieve Team Rosters
Retrieve data on all rosters, including salary and contract data if your league uses it, as well as all players on the rosters, their statuses, positions. This is retrieved for the upcoming/current period that is not yet locked from lineups.

*   **URL**: `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=[League ID]`
*   **Request Parameters**: None

### Response structure
The endpoint returns a JSON object with two keys: `period` and `rosters`. `period` indicates the upcoming scoring period for which the rosters are valid. `rosters` is an object keyed by franchise ID; each value describes that team’s current roster:

```json
{
  "period": 142,
  "rosters": {
    "f3fffq89m85d4iq3": {
      "teamName": "One Diaz Pizza",
      "rosterItems": [
        {
          "id": "041rf",
          "position": "P",
          "status": "INJURED_RESERVE"
        },
        {
          "id": "0603p",
          "position": "P",
          "status": "ACTIVE"
        }
      ]
    },
    "6pid6t1cm857ylaq": {
      "teamName": "Boofed Bonser",
      "rosterItems": [
        {
          "id": "050c3",
          "position": "OF",
          "status": "ACTIVE"
        }
      ]
    }
  }
}
```

Each `rosterItem` entry includes:
*   `id` (string) – Fantrax player ID.
*   `position` (string) – the fantasy position slot occupied (e.g., "P", "OF", "SS").
*   `status` (string) – roster status. Common values:
    *   `ACTIVE` – player is starting or on the active roster.
    *   `RESERVE` – on the bench.
    *   `MINORS` – on a minor‑league/reserve list.
    *   `INJURED_RESERVE` – on injured reserve.

## Retrieve League Standings
Retrieve the current standings of the league. This includes basic standings data, such as the rank, points, W-L-T, games back, win %, etc. Individual stats are not yet included, but will be in a future release.

*   **URL**: `https://www.fantrax.com/fxea/general/getStandings?leagueId=[League ID]`
*   **Request Parameters**: None

### Response structure
The standings endpoint returns an array of teams sorted by their rank. Each object represents a franchise and includes basic results metrics:
```json
[
  {
    "teamName": "One Diaz Pizza",
    "teamId": "f3fffq89m85d4iq3",
    "gamesBack": 0.0,
    "rank": 1,
    "points": "131-74-11",
    "winPercentage": 0.632
  },
  {
    "teamName": "Bravos",
    "teamId": "wzdzmdv2m858uuy4",
    "gamesBack": 6.5,
    "rank": 2,
    "points": "124-80-12",
    "winPercentage": 0.602
  }
]
```

**Field descriptions:**
*   `teamName` (string) – the franchise name.
*   `teamId` (string) – unique franchise identifier.
*   `gamesBack` (number) – number of games behind the first‑place team.
*   `rank` (integer) – current standing rank (1 = first place).
*   `points` (string) – composite record of wins, losses and ties (for example "118-89-9" means 118 wins, 89 losses, 9 ties).
*   `winPercentage` (number) – winning percentage expressed as a decimal (0.500 = .500).

---
### References
1.  **Get Player Ids**: `https://www.fantrax.com/fxea/general/getPlayerIds`
2.  **Get ADP**: `https://www.fantrax.com/fxea/general/getAdp`
3.  **Get League Info**: `https://www.fantrax.com/fxea/general/getLeagueInfo`
4.  **Get Draft Results**: `https://www.fantrax.com/fxea/general/getDraftResults`
5.  **Get Team Rosters**: `https://www.fantrax.com/fxea/general/getTeamRosters`
6.  **Get Standings**: `https://www.fantrax.com/fxea/general/getStandings`
