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