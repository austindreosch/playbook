# Google Sheets Integration for Commissioner Tools

## Overview

This document outlines the structure for integrating Google Sheets as a dummy database for the commissioner recruitment system. This allows commissioners to manage league data through a familiar spreadsheet interface.

## Google Sheets Structure

### Main Spreadsheet Tabs

#### 1. Leagues Sheet (`Leagues`)

| Column | Field                | Description                                                 |
| ------ | -------------------- | ----------------------------------------------------------- |
| A      | leagueId             | Unique identifier for the league                            |
| B      | leagueName           | Display name of the league                                  |
| C      | sport                | Sport type (NFL, NBA, MLB)                                  |
| D      | format               | League format (Dynasty, Redraft, Keeper)                    |
| E      | scoring              | Scoring type (Points, Categories)                           |
| F      | totalTeams           | Total number of teams in league                             |
| G      | availableSpots       | Number of open spots                                        |
| H      | description          | League description for recruitment                          |
| I      | status               | League status (recruiting, full, draft_complete, in_season) |
| J      | created_date         | When league was created                                     |
| K      | recruitment_deadline | Last date to accept new members                             |

#### 2. Commissioners Sheet (`Commissioners`)

| Column | Field              | Description                  |
| ------ | ------------------ | ---------------------------- |
| A      | leagueId           | Reference to league          |
| B      | commissioner_name  | Commissioner's full name     |
| C      | commissioner_email | Commissioner's email address |
| D      | playbook_user_id   | User ID in Playbook system   |

#### 3. League Settings Sheet (`Settings`)

| Column | Field           | Description                      |
| ------ | --------------- | -------------------------------- |
| A      | leagueId        | Reference to league              |
| B      | draftDate       | Scheduled draft date             |
| C      | entryFee        | League entry fee                 |
| D      | payoutStructure | Prize distribution               |
| E      | waiverSystem    | Waiver wire system               |
| F      | tradeDeadline   | Trade deadline                   |
| G      | roster_starters | Starter positions                |
| H      | roster_bench    | Bench spots                      |
| I      | roster_ir       | IR spots                         |
| J      | roster_taxi     | Taxi squad spots (if applicable) |

#### 4. Sport-Specific Settings Sheets

##### NFL Settings (`NFL_Settings`)

| Column | Field       | Description                    |
| ------ | ----------- | ------------------------------ |
| A      | leagueId    | Reference to league            |
| B      | ppr_setting | PPR setting (0, 0.5, 1)        |
| C      | superflex   | Superflex enabled (true/false) |
| D      | idp         | IDP enabled (true/false)       |

##### NBA Settings (`NBA_Settings`)

| Column | Field       | Description                          |
| ------ | ----------- | ------------------------------------ |
| A      | leagueId    | Reference to league                  |
| B      | categories  | Scoring categories (comma-separated) |
| C      | games_limit | Weekly games limit                   |

##### MLB Settings (`MLB_Settings`)

| Column | Field         | Description                          |
| ------ | ------------- | ------------------------------------ |
| A      | leagueId      | Reference to league                  |
| B      | categories    | Scoring categories (comma-separated) |
| C      | innings_limit | Weekly innings limit                 |
| D      | start_limit   | Weekly start limit                   |

#### 5. Join Requests Sheet (`Join_Requests`)

| Column | Field        | Description                                  |
| ------ | ------------ | -------------------------------------------- |
| A      | request_id   | Unique request identifier                    |
| B      | leagueId     | Reference to league                          |
| C      | first_name   | Applicant's first name                       |
| D      | last_name    | Applicant's last name                        |
| E      | email        | Applicant's email                            |
| F      | team_name    | Preferred team name                          |
| G      | experience   | Fantasy experience description               |
| H      | status       | Request status (pending, approved, rejected) |
| I      | submitted_at | When request was submitted                   |
| J      | reviewed_at  | When request was reviewed                    |
| K      | notes        | Commissioner notes                           |

## Implementation Steps

### Phase 1: Setup

1. Create Google Sheets API credentials
2. Set up authentication in environment variables
3. Create helper functions for reading/writing sheets

### Phase 2: Data Layer

1. Replace dummy data functions with Google Sheets API calls
2. Implement caching for performance
3. Add error handling and retry logic

### Phase 3: Admin Interface

1. Create commissioner dashboard for managing leagues
2. Add form for creating new leagues
3. Implement join request management interface

## Environment Variables Required

```env
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...-----END PRIVATE KEY-----
```

## API Integration Points

### Current Dummy Functions to Replace:

- `getCommissionerLeagueData(leagueID)` → Read from Leagues + Settings sheets
- `getAvailableLeagues()` → Filter Leagues sheet for recruiting status
- Join request submission → Write to Join_Requests sheet

### New Functions Needed:

- `createLeague(leagueData)` → Write to multiple sheets
- `updateLeagueSettings(leagueId, settings)` → Update Settings sheet
- `getJoinRequests(leagueId)` → Read Join_Requests sheet
- `updateJoinRequestStatus(requestId, status)` → Update Join_Requests sheet

## Sport-Agnostic Design

The structure is designed to be sport-agnostic with sport-specific extensions:

1. **Core league data** is stored in main sheets
2. **Sport-specific settings** use separate sheets per sport
3. **Position mappings** are defined in code constants
4. **Scoring categories** are stored as comma-separated values in sport sheets

## Future Enhancements

1. **Real-time updates** using Google Sheets webhooks
2. **Email notifications** when join requests are submitted/updated
3. **League templates** for quick setup of common configurations
4. **Bulk operations** for managing multiple leagues
5. **Analytics dashboard** showing recruitment metrics

## Example League Creation Workflow

1. Commissioner fills out league creation form
2. System writes to Leagues, Commissioners, and Settings sheets
3. Sport-specific settings written to appropriate sport sheet
4. League becomes available at `/commissioner/recruit/{leagueId}`
5. Join requests populate Join_Requests sheet
6. Commissioner reviews and approves/rejects via admin interface
