# Sleeper API Documentation (v1)

This document is a reference guide for the Sleeper REST API. The Sleeper API is a read-only HTTP API used to access fantasy sports data such as leagues, rosters, drafts and players. Unlike many fantasy APIs, it does not support modifications; therefore no authentication token is required. Sleeper requests are free and return JSON responses. The developers recommend staying below 1,000 API calls per minute to avoid being blocked.

## General Usage

- **Base URL** – All endpoints are under `https://api.sleeper.app/v1/`.
- **HTTP verbs** – All operations are `GET` requests because the API is read-only. There is no support for `POST`, `PUT` or `DELETE`.
- **Rate limit** – Although the API does not publish strict limits, the documentation advises keeping requests below roughly 1000 per minute.
- **Authentication** – No API key or OAuth token is required; data is public. However, the API only exposes information about leagues, rosters and drafts, not personal user data.

## Resources

The API is grouped into several resources: Users, Avatars, Leagues, Drafts, Players and Errors. Each resource has its own set of endpoints.

### 1. User

The user resource lets you fetch basic information about a Sleeper user. Users can be retrieved by their username or their numeric ID. Note that usernames may change; therefore applications should store and reference the immutable `user_id`.

**Retrieve a User**

```
GET https://api.sleeper.app/v1/user/<username>
GET https://api.sleeper.app/v1/user/<user_id>
```

**URL Parameters**

| Parameter  | Description                                                      |
| :--------- | :--------------------------------------------------------------- |
| `username` | The user’s Sleeper handle. Usernames can change over time.       |
| `user_id`  | The user’s numeric identifier; recommended for long-term references |

The endpoint returns a small object containing `username`, `user_id`, `display_name` and `avatar`.

### 2. Avatars

Users and leagues have avatar images that can be embedded in your application. Both full-size and thumbnail URLs are available. The URLs follow a simple pattern:

- **Full-size image**: `https://sleepercdn.com/avatars/<avatar_id>`
- **Thumbnail**: `https://sleepercdn.com/avatars/thumbs/<avatar_id>`

Replace `<avatar_id>` with the `avatar` field returned in the user or league objects.

### 3. Leagues

The league endpoints are used to list a user’s leagues, fetch league details and examine rosters, users, matchups and transactions.

#### 3.1 Get all leagues for a user

This call returns all leagues that a user participates in for a given sport and season. It includes high-level league configuration such as roster positions, scoring settings and the associated draft ID.

```
GET https://api.sleeper.app/v1/user/<user_id>/leagues/<sport>/<season>
```

**URL Parameters**

| Parameter | Description                                                |
| :-------- | :--------------------------------------------------------- |
| `user_id` | Numeric ID of the user whose leagues you want to retrieve   |
| `sport`   | Currently only `nfl` is supported                          |
| `season`  | Season year, e.g., `2018` or `2024`                        |

The response is an array of league objects with fields such as `league_id`, `name`, `season`, `sport`, `status` (pre_draft/drafting/in_season/complete) and references to the associated draft.

#### 3.2 Get a specific league

Retrieve detailed information about a single league using its ID. The response contains league settings, roster positions, scoring settings, and identifiers for drafts and previous leagues.

```
GET https://api.sleeper.app/v1/league/<league_id>
```

| Parameter   | Description                  |
| :---------- | :--------------------------- |
| `league_id` | ID of the league to retrieve |

#### 3.3 Get rosters in a league

Lists all rosters within a league. Each roster object includes the list of player IDs currently on the roster, starter positions, points scored, waiver position and other team settings.

```
GET https://api.sleeper.app/v1/league/<league_id>/rosters
```

| Parameter   | Description     |
| :---------- | :-------------- |
| `league_id` | ID of the league |

#### 3.4 Get users in a league

Returns all users in a league along with their display names, avatars and metadata. The `is_owner` flag identifies commissioners.

```
GET https://api.sleeper.app/v1/league/<league_id>/users
```

| Parameter   | Description     |
| :---------- | :-------------- |
| `league_id` | ID of the league |

#### 3.5 Get matchups in a league

Returns matchups for a specified week. Each object represents a team within that matchup. Teams sharing the same `matchup_id` face each other. The response includes the list of starters (in order), all player IDs on the team for that week, total points scored and optional `custom_points` overrides.

```
GET https://api.sleeper.app/v1/league/<league_id>/matchups/<week>
```

| Parameter   | Description               |
| :---------- | :------------------------ |
| `league_id` | ID of the league          |
| `week`      | Week number of the matchup |

#### 3.6 Get the playoff bracket

Sleeper provides two playoff bracket endpoints for winners and losers brackets. Each row represents a playoff match, including round number, match ID and which team (by `roster_id` or winner/loser from another match) will play. The `w` and `l` fields identify winners and losers when available.

```
GET https://api.sleeper.app/v1/league/<league_id>/winners_bracket
GET https://api.sleeper.app/v1/league/<league_id>/losers_bracket
```

| Parameter   | Description     |
| :---------- | :-------------- |
| `league_id` | ID of the league |

#### 3.7 Get transactions

Retrieves free-agent transactions, waivers and trades for a given week (also referred to as a “round”). The response includes arrays of `adds`, `drops`, `draft_picks` moved and any `FAAB` budget transferred. Each transaction object has fields such as `type` (trade/free_agent/waiver), `transaction_id`, `status`, `roster_ids` involved, timestamps and the user who initiated the move.

```
GET https://api.sleeper.app/v1/league/<league_id>/transactions/<round>
```

| Parameter   | Description                          |
| :---------- | :----------------------------------- |
| `league_id` | ID of the league                     |
| `round`     | Week or leg to pull transactions from |

#### 3.8 Get traded picks

Returns all traded draft picks in a league, including future seasons. Each object shows the season, round, original owner, previous owner and current owner of the pick.

```
GET https://api.sleeper.app/v1/league/<league_id>/traded_picks
```

| Parameter   | Description     |
| :---------- | :-------------- |
| `league_id` | ID of the league |

#### 3.9 Get sport state

Returns information about the current state of a sport, including the current week (`week`), season (`season`), season type (`pre`, `regular` or `post`) and display week used by the UI. The response also contains `league_season` and `league_create_season` values which indicate the active season and the season used when creating new leagues.

```
GET https://api.sleeper.app/v1/state/<sport>
```

| Parameter | Description                       |
| :-------- | :-------------------------------- |
| `sport`   | The sport (e.g., `nfl`, `nba`, `lcs`) |

### 4. Drafts

These endpoints allow you to list and inspect drafts. A league can have multiple drafts (especially dynasty leagues), and drafts are sorted by most recent first.

#### 4.1 Get all drafts for a user

Returns every draft for a user for a particular sport and season. Each draft object contains settings such as number of teams, roster slots, scoring format, start time, and references to the associated league and draft board.

```
GET https://api.sleeper.app/v1/user/<user_id>/drafts/<sport>/<season>
```

| Parameter | Description                  |
| :-------- | :--------------------------- |
| `user_id` | Numeric ID of the user       |
| `sport`   | Sport, currently only `nfl`  |
| `season`  | Season year (e.g., `2017`, `2018`) |

#### 4.2 Get all drafts for a league

Returns all drafts associated with a specific league. Each entry contains the same information as above. Leagues with only one draft return a single object; dynasty leagues may return multiple drafts sorted by most recent.

```
GET https://api.sleeper.app/v1/league/<league_id>/drafts
```

| Parameter   | Description     |
| :---------- | :-------------- |
| `league_id` | ID of the league |

#### 4.3 Get a specific draft

Retrieves detailed information about a draft, including roster slot configuration, draft order, mapping of draft slots to roster IDs, draft start time and metadata like scoring type and league name.

```
GET https://api.sleeper.app/v1/draft/<draft_id>
```

| Parameter  | Description                |
| :--------- | :------------------------- |
| `draft_id` | ID of the draft to retrieve |

#### 4.4 Get all picks in a draft

Returns every pick on the draft board. Each pick record contains the selected `player_id`, the `roster_id` receiving the pick, the draft slot and round, pick number, whether the pick is a keeper, and a metadata object with player details (team, position, status, etc.).

```
GET https://api.sleeper.app/v1/draft/<draft_id>/picks
```

| Parameter  | Description     |
| :--------- | :-------------- |
| `draft_id` | ID of the draft |

#### 4.5 Get traded picks in a draft

Returns a list of traded picks within a draft. Each record indicates the season, round and changes in ownership (original owner, previous owner and current owner).

```
GET https://api.sleeper.app/v1/draft/<draft_id>/traded_picks
```

| Parameter  | Description     |
| :--------- | :-------------- |
| `draft_id` | ID of the draft |

### 5. Players

The players endpoints provide a mapping of player IDs to player details and highlight trending adds and drops.

#### 5.1 Fetch all players

Returns a large dictionary mapping player IDs to player objects. Each player object includes fields such as name, team, position, fantasy positions, status, height, weight, college, age, ESPN/Yahoo/Rotoworld identifiers and search keys. Due to its size (~5 MB), this endpoint is intended to be called sparingly—ideally once daily—to refresh your local player database.

```
GET https://api.sleeper.app/v1/players/<sport>
```

| Parameter | Description                                                           |
| :-------- | :-------------------------------------------------------------------- |
| `sport`   | Sport (e.g., `nfl`). Currently only NFL players are available via this API |

#### 5.2 Trending players

Provides a list of the most added or dropped players over a given time window. The response consists of objects containing a `player_id` and a `count` representing the number of adds or drops.

```
GET https://api.sleeper.app/v1/players/<sport>/trending/<type>?lookback_hours=<hours>&limit=<int>
```

**URL Parameters**

| Parameter        | Description                                                 |
| :--------------- | :---------------------------------------------------------- |
| `sport`          | Sport (e.g., `nfl`)                                         |
| `type`           | Either `add` or `drop` to request trending adds or trending drops |
| `lookback_hours` | Number of hours to look back (default is 24)                |
| `limit`          | Maximum number of players to return (default is 25)         |

### 6. Errors

The Sleeper API uses standard HTTP status codes. Common responses include:

| Code | Meaning                                                              |
| :--- | :------------------------------------------------------------------- |
| 400  | **Bad Request** – The request was invalid.                           |
| 404  | **Not Found** – The specified resource (e.g., user, league) could not be found. |
| 429  | **Too Many Requests** – You have exceeded the rate limit.              |
| 500  | **Internal Server Error** – The server encountered an error; try again later. |
| 503  | **Service Unavailable** – The service is temporarily offline for maintenance. |

### Best Practices

- **Cache player data** – The `/players` endpoint returns a large payload (~5 MB) and should not be queried repeatedly during a single session. Cache the results locally and refresh daily.
- **Use user IDs** – Since usernames can change, always use the numeric `user_id` when storing references to users.
- **Respect rate limits** – Keep your request rate under 1,000 calls per minute to avoid being IP-blocked.
- **Understand roster IDs** – Many endpoints return `roster_id` (not `user_id`). Use `/league/<league_id>/rosters` to map roster IDs to owners.

### See Also

For interactive examples, code snippets and embed widgets (such as trending players), see the official Sleeper API documentation at https://docs.sleeper.com/



## Sleeper API Documentation (v1) — with Response Structures

Read-only JSON REST API. No auth token. Keep calls under ~1,000/min to avoid IP blocks.

---

### Base
*	**REST host**: `https://api.sleeper.app/v1`
*	**CDN for avatars**: `https://sleepercdn.com/avatars/...` (full) and `.../thumbs/...` (thumb).

---

### User

#### Get User

```
GET /user/<username>
GET /user/<user_id>
```

**Response**

```json
{
  "username": "sleeperuser",
  "user_id": "12345678",
  "display_name": "SleeperUser",
  "avatar": "cc12ec49965eb7856f84d71cf85306af"
}
```

*Notes: username can change; persist user_id.*

#### Avatars
*	**Full**: `https://sleepercdn.com/avatars/<avatar_id>`
*	**Thumb**: `https://sleepercdn.com/avatars/thumbs/<avatar_id>`

---

### Leagues

#### Get All Leagues for a User (by sport/season)

```
GET /user/<user_id>/leagues/<sport>/<season>
```

**Response (array of leagues)**

```json
[{
  "total_rosters": 12,
  "status": "pre_draft",         // "pre_draft" | "drafting" | "in_season" | "complete"
  "sport": "nfl",
  "settings": { /* league settings object */ },
  "season_type": "regular",
  "season": "2018",
  "scoring_settings": { /* scoring settings */ },
  "roster_positions": ["QB","RB","WR","TE","FLEX","BN", "DEF", "K"],
  "previous_league_id": "198946952535085056",
  "name": "Sleeperbot Friends League",
  "league_id": "289646328504385536",
  "draft_id": "289646328508579840",
  "avatar": "efaefa889ae24046a53265a3c71b8b64"
}]
```

**Key nested structures**
*	`settings`: per-league knobs (teams, rounds, pick_timer, etc.; see “Drafts → settings” for common fields).
*	`scoring_settings`: dict of category→weight (e.g., pass_yd, rec_td).
*	`roster_positions`: ordered list of slot types.

#### Get League

```
GET /league/<league_id>
```

Response – same shape as one element from list above, with full `settings`, `scoring_settings`, and `roster_positions`.

#### Get Rosters

```
GET /league/<league_id>/rosters
```

**Response (array of rosters)**

```json
[{
  "starters": ["2307","2257","4034","147","642","4039","515","4149","DET"], // player_ids & team DST
  "settings": {
    "wins": 5, "waiver_position": 7, "waiver_budget_used": 0,
    "total_moves": 0, "ties": 0, "losses": 9,
    "fpts_decimal": 78, "fpts_against_decimal": 32,
    "fpts_against": 1670, "fpts": 1617
  },
  "roster_id": 1,
  "reserve": [],                    // IR/taxi list (when applicable)
  "players": ["1046","138","147","2257","2307","2319","4034","4039","4040","4149","421","515","642","745","DET"],
  "owner_id": "188815879448829952", // user_id
  "league_id": "206827432160788480"
}]
```

**Interpretation**
*	Bench = `players` minus `starters`.
*	`settings.fpts*` reflect cumulative scoring per roster.

#### Get Users in a League

```
GET /league/<league_id>/users
```

**Response**

```json
[{
  "user_id": "188815879448829952",
  "username": "name",
  "display_name": "Name",
  "avatar": "1233456789",
  "metadata": { "team_name": "Dezpacito" },
  "is_owner": true                 // commissioner flag; multiple possible
}]
```

#### Get Matchups (by week)

```
GET /league/<league_id>/matchups/<week>
```

**Response (array of team entries)**
Each entry = one team in a pairing; teams that share `matchup_id` face each other.

```json
[{
  "starters": ["421","4035","3242","2133","2449","4531","2257","788","PHI"],
  "roster_id": 1,
  "players": ["1352","1387","2118","2133","2182","223","2319","2449","3208","4035","421","4881","4892","788","CLE"],
  "matchup_id": 2,
  "points": 20.0,          // computed by league scoring
  "custom_points": null    // commissioner override if present
}]
```

Bench derivation: `players` - `starters`.

#### Get Playoff Brackets

```
GET /league/<league_id>/winners_bracket
GET /league/<league_id>/losers_bracket
```

**Response (array)**
Fields per row:

```json
{ "r":1, "m":1, "t1":3, "t2":6, "w":null, "l":null,
  "t1_from": {"w":1}, "t2_from": {"l":2}, "p":5 }
```

*	`r`: round; `m`: match id;
*	`t1`/`t2`: `roster_id` or `{w:<m>}` / `{l:<m>}` meaning winner/loser from match `m`;
*	`w`/`l`: winning/losing `roster_id` when complete;
*	`p`: placement (e.g., 1 for championship).

#### Get Transactions (by round = week)

```
GET /league/<league_id>/transactions/<round>
```

**Response (array of transactions)**

```json
[{
  "type": "trade" | "free_agent" | "waiver",
  "transaction_id": "434852362033561600",
  "status_updated": 1558039402803,
  "status": "complete" | "failed" | "pending",
  "settings": null,                      // or {"waiver_bid": 44} on FAAB
  "roster_ids": [2,1],                   // involved rosters
  "metadata": null,                      // may include failure reason for waivers
  "leg": 1,                              // NFL week
  "drops": { "1736": 1 },                // player_id -> roster_id
  "adds":  { "2315": 1 },                // player_id -> roster_id
  "draft_picks": [{
    "season": "2019", "round": 5, "roster_id": 1,
    "previous_owner_id": 1, "owner_id": 2
  }],
  "waiver_budget": [{
    "sender": 2, "receiver": 3, "amount": 55
  }],
  "creator": "160000000000000000",       // user_id
  "created": 1558039391576,
  "consenter_ids": [2,1]                 // roster_ids who accepted
}]
```

#### Get Traded Picks (league-wide)

```
GET /league/<league_id>/traded_picks
```

**Response**

```json
[{
  "season": "2019",
  "round": 5,
  "roster_id": 1,            // original owner
  "previous_owner_id": 1,    // prior owner
  "owner_id": 2              // current owner
}]
```

#### Get Sport State

```
GET /state/<sport>   // e.g. /state/nfl
```

**Response**

```json
{
  "week": 2,
  "season_type": "regular",           // "pre" | "regular" | "post"
  "season_start_date": "2020-09-10",
  "season": "2020",
  "previous_season": "2019",
  "leg": 2,                           // current regular-season week
  "league_season": "2021",            // active season for leagues
  "league_create_season": "2021",     // flips in December
  "display_week": 3                   // UI display week
}
```


---

### Drafts

#### Get All Drafts for a User

```
GET /user/<user_id>/drafts/<sport>/<season>
```

**Response (array of drafts)**

```json
[{
  "type": "snake" | "auction",
  "status": "pre_draft" | "drafting" | "complete",
  "start_time": 1515700800000,
  "sport": "nfl",
  "settings": {
    "teams": 6, "slots_wr": 2, "slots_te": 1, "slots_rb": 2, "slots_qb": 1,
    "slots_k": 1, "slots_flex": 2, "slots_def": 1, "slots_bn": 5,
    "rounds": 15, "pick_timer": 120
  },
  "season_type": "regular",
  "season": "2017",
  "metadata": { "scoring_type": "ppr", "name": "My Dynasty", "description": "" },
  "league_id": "257270637750382592",
  "last_picked": 1515700871182,
  "last_message_time": 1515700942674,
  "last_message_id": "257272036450111488",
  "draft_order": null,
  "draft_id": "257270643320426496",
  "creators": null,
  "created": 1515700610526
}]
```

#### Get Drafts for a League

```
GET /league/<league_id>/drafts
```

Response – same shape as above; sorted newest→oldest.

#### Get Draft

```
GET /draft/<draft_id>
```

**Response**

```json
{
  "type": "snake",
  "status": "complete",
  "start_time": 1515700800000,
  "sport": "nfl",
  "settings": { /* same keys as above */ },
  "season_type": "regular",
  "season": "2017",
  "metadata": { "scoring_type": "ppr", "name": "My Dynasty", "description": "" },
  "league_id": "257270637750382592",
  "last_picked": 1515700871182,
  "last_message_time": 1515700942674,
  "last_message_id": "257272036450111488",

  "draft_order": { "12345678": 1, "23434332": 2 },   // user_id -> slot
  "slot_to_roster_id": { "1": 10, "2": 3, "3": 5 },  // slot -> roster_id

  "draft_id": "257270643320426496",
  "creators": null,
  "created": 1515700610526
}
```

#### Get Draft Picks

```
GET /draft/<draft_id>/picks
```

**Response (array)**

```json
[{
  "player_id": "2391",
  "picked_by": "234343434",   // user_id (can be "")
  "roster_id": "1",           // destination roster
  "round": 5,
  "draft_slot": 5,            // column on board
  "pick_no": 1,
  "metadata": {
    "team": "ARI", "status": "Active|IR", "sport": "nfl",
    "position": "RB", "player_id": "2391", "number": "31",
    "news_updated": "1513007102037", "last_name": "Johnson",
    "injury_status": "Out", "first_name": "David"
  },
  "is_keeper": null,
  "draft_id": "257270643320426496"
}]
```

#### Get Traded Picks in a Draft

```
GET /draft/<draft_id>/traded_picks
```

Response – same traded-pick shape as league endpoint.

---

### Players

#### Fetch All Players (NFL)

```
GET /players/nfl
```

**Response (map of player_id → player object)**

```json
{
  "3086": {
    "player_id":"3086",
    "first_name":"Tom","last_name":"Brady","search_full_name":"tombrady",
    "search_first_name":"tom","search_last_name":"brady","search_rank":24,
    "team":"NE","position":"QB","fantasy_positions":["QB"],"number":12,
    "status":"Active","injury_status":null,"injury_start_date":null,
    "depth_chart_position":1,"depth_chart_order":1,
    "age":40,"height":"6'4\"","weight":"220","college":"Michigan",
    "years_exp":14,"birth_country":"United States",
    "hashtag":"#TomBrady-NFL-NE-12",
    "practice_participation":null,
    "sport":"nfl",
    "espn_id":"","yahoo_id":null,"rotoworld_id":8356,"rotowire_id":null,
    "stats_id":"","sportradar_id":"","fantasy_data_id":17836
  }
}
```

Usage guidance: Call ≤1/day; ~5MB payload. Persist locally to resolve `player_id` in rosters/matchups.

#### Trending Players

```
GET /players/<sport>/trending/<type>?lookback_hours=<int>&limit=<int>
// type: add | drop, default lookback 24h, default limit 25
```

**Response**

```json
[{ "player_id": "1111", "count": 45 }]
```

(Embeddable iframe also available in docs.)

---

### Errors

HTTP status codes used include: 400, 404, 429, 500, 503. (Docs show playful copy but semantics are standard.)

---

### Quick sanity checks with your league

You provided league_id = 1180086763643736064. Useful test calls (no auth):
*	**League**: `GET https://api.sleeper.app/v1/league/1180086763643736064`
*	**Rosters**: `GET https://api.sleeper.app/v1/league/1180086763643736064/rosters`
*	**Users**: `GET https://api.sleeper.app/v1/league/1180086763643736064/users`
*	**Matchups (week N)**: `GET https://api.sleeper.app/v1/league/1180086763643736064/matchups/<week>`
*	**Transactions (week N)**: `GET https://api.sleeper.app/v1/league/1180086763643736064/transactions/<round>`
*	**Traded picks**: `GET https://api.sleeper.app/v1/league/1180086763643736064/traded_picks`

These will return in the exact shapes shown above.

