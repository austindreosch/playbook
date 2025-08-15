# Playbook Fantasy Sports - Comprehensive Design Document

## Executive Summary

**Playbook** is a sophisticated fantasy sports platform built with Next.js 15 that provides AI-powered insights, player rankings, trade analysis, and league management for NBA, NFL, and MLB fantasy leagues. The application follows a sport-agnostic design philosophy, allowing features to work seamlessly across multiple sports while maintaining sport-specific optimizations.

## Current State vs Future Vision

### What Playbook Does Now
- **Multi-Sport Support**: Active support for NBA, NFL, and MLB with unified data processing
- **Player Analytics**: Advanced statistical analysis with Z-score calculations and performance metrics
- **Rankings System**: User-created and expert rankings with customizable scoring systems
- **Trade Analysis**: Sophisticated trade calculator with value assessment
- **League Management**: Basic league import and roster analysis (currently Fantrax-focused)
- **Dashboard Interface**: Customizable widget-based dashboard with real-time data

### Future Roadmap (Based on TODO List)
1. **Complete League Import Flow**: Multi-platform support (Sleeper, Yahoo, ESPN, Fantrax)
2. **Enhanced Dataset Management**: 5 datasets per sport with smart caching
3. **Playbook Score System**: Proprietary scoring algorithm with user preferences
4. **News Integration**: Player-specific and league-wide news feeds
5. **Commissioner Tools**: Advanced league management features

## Technical Architecture

### Technology Stack
- **Frontend**: Next.js 15 (App Router + Pages API), React 18, TypeScript
- **Backend**: MongoDB (direct driver, no Mongoose), Next.js API routes
- **Authentication**: Auth0
- **Styling**: Tailwind CSS, ShadCN UI, DaisyUI, AlignUI components
- **State Management**: Zustand (3 main stores)
- **External APIs**: MySportsFeeds, FantasyCalc, Fantrax API
- **Deployment**: Vercel

### Data Architecture

#### Database Schema (MongoDB)
```javascript
// Collections:
players: {
  _id: ObjectId,
  playbookId: String,
  name: String,
  sport: String,
  team: String,
  position: String,
  mySportsFeedsId: Number,
  // Sport-agnostic fields with sport-specific extensions
}

leagues: {
  _id: ObjectId,
  userId: String,
  platform: String, // 'fantrax', 'sleeper', 'yahoo', 'espn'
  sport: String,
  dynasty: Boolean,
  teams: Array,
  rosters: Array,
  settings: Object
}

stats: {
  _id: ObjectId,
  sport: String,
  endpoint: String, // 'seasonalPlayerStats', 'seasonalTeamStats'
  data: Object // Raw API response data
}

rankings: {
  _id: ObjectId,
  userId: String,
  name: String,
  sport: String,
  format: String, // 'dynasty', 'redraft'
  scoring: String, // 'points', 'categories'
  players: Array
}
```

#### Data Flow Pipeline
1. **Raw Data Ingestion**: External APIs → MongoDB collections
2. **Data Processing**: Sport-specific processors with Z-score calculations
3. **State Management**: Processed data → Zustand stores
4. **UI Rendering**: Store data → React components

### State Management Architecture

#### 1. Master Dataset Store (`stores/useMasterDataset.js`)
**Purpose**: Central repository for all player data across sports
```javascript
Structure: {
  dataset: {
    nba: { players: {}, identities: [], teamTotals: {}, lastUpdated: null },
    mlb: { players: {}, identities: [], teamTotals: {}, lastUpdated: null },
    nfl: { players: {}, identities: [], teamTotals: {}, lastUpdated: null }
  },
  loading: { nba: false, mlb: false, nfl: false, rawData: false },
  error: { nba: null, mlb: null, nfl: null, rawData: null }
}
```

**Key Features**:
- Sport-specific data processors with Z-score calculations
- Automated caching and state size monitoring
- Parallel identity and stats fetching
- Error handling per sport

#### 2. Dashboard Context (`stores/dashboard/useDashboardContext.js`)
**Purpose**: League-specific state and UI management
```javascript
Structure: {
  currentLeagueId: String,
  leagues: Array,
  currentTab: String,
  currentView: String,
  isAllLeaguesView: Boolean,
  userRankings: Array,
  widgetLayout: Object,
  tradeValueMode: String
}
```

**Key Features**:
- Persistent localStorage integration
- Dynamic tab management based on context
- League switching with state preservation
- Widget layout customization

#### 3. User Rankings Store (`stores/useUserRankings.js`)
**Purpose**: User-created ranking lists with CRUD operations

### Component Architecture

#### Design Principles
1. **Sport-Agnostic Design**: Every component designed to work across NBA/NFL/MLB
2. **Feature-Based Organization**: Components grouped by functionality
3. **Reusable UI Foundation**: Built on ShadCN + custom AlignUI system
4. **Dynamic Rendering**: Widget-based dashboard with drag-and-drop

#### Key Component Categories

##### 1. Dashboard Widgets (`components/dashboard/Overview/`)
```javascript
// Widget Registry
const widgetMap = {
  standings: { component: StandingsWidget, size: 3 },
  matchup: { component: MatchupsWidget, size: 7 },
  newsFeed: { component: NewsWidget, size: 7 },
  teamArchetype: { component: TeamArchetypeWidget, size: 3 },
  teamProfile: { component: TeamProfileWidget, size: 4 },
  actionSteps: { component: ActionStepsWidget, size: 6 }
};
```

##### 2. Sport-Specific Components
- **NBA**: `components/PlayerList/NBA/` (DetailPanelNBA, InsightPanelNBA)
- **NFL**: `components/PlayerList/NFL/` (DetailPanelNFL, InsightPanelNFL)  
- **MLB**: `components/PlayerList/MLB/` (DetailPanelMLB, InsightPanelMLB)

##### 3. UI Foundation
- **AlignUI**: Custom design system (`components/alignui/`)
- **ShadCN**: Base components (`components/ui/`)
- **Common**: Shared utilities (`components/common/`)

### API Architecture

#### API Route Organization
```
pages/api/
├── load/           # Data fetching endpoints
├── players/        # Player data management
├── rankings/       # Rankings CRUD operations
├── admin/          # Administrative functions
├── auth/           # Authentication endpoints
└── user-rankings/  # User ranking management
```

#### Key API Endpoints

##### 1. Master Dataset API (`/api/load/MasterDatasetFetch.js`)
**Purpose**: Fetch comprehensive sports data from MongoDB
```javascript
Response Structure: {
  nbaStats: {
    playerStatsTotals: Array,
    playerStatsProjectedTotals: Array
  },
  mlbStats: {
    playerStatsTotals: Array,
    playerStatsProjectedTotals: Array
  },
  nflStats: {
    stats: { seasonalPlayerStats: { players: Array } },
    teamStatsTotals: Array
  }
}
```

##### 2. League Import API (`/api/importleague.js`)
**Purpose**: Save imported league data to MongoDB
- Supports GET (retrieve leagues) and POST (save league)
- Integrates with Fantrax API for roster data

### Data Processing System

#### Sport-Specific Processors
1. **NBA**: `lib/utils/nbaDataProcessing.js`
2. **NFL**: `lib/utils/nflDataProcessing.js` (includes team totals)
3. **MLB**: `lib/utils/mlbDataProcessing.js` (includes projections)

#### Z-Score Calculation Engine (`lib/calculations/zScoreUtil.js`)
**Purpose**: Advanced statistical analysis with sport-specific configurations
```javascript
Features:
- Positional comparison pools
- Category-specific weightings
- Percentile-based scoring
- Color-coded performance indicators
```

#### Playbook Score Algorithm (`utilities/calculateScore.js`)
**Current**: NBA-focused scoring with dynasty rank and age factors
**Future**: Multi-sport expansion with user preference modifiers

## User Experience Flow

### Current User Journey
1. **Authentication**: Auth0 login/registration
2. **Dashboard Access**: Admin-gated during development
3. **League Import**: Fantrax league connection
4. **Data Analysis**: Player rankings, trade calculator, roster analysis
5. **Customization**: Widget arrangement, ranking preferences

### Future Enhanced Journey
1. **Onboarding**: Platform selection (Fantrax/Sleeper/Yahoo/ESPN)
2. **League Import**: Automated multi-platform connection
3. **Personalization**: Scoring preferences, punt strategies
4. **Daily Workflow**: News updates, waiver suggestions, trade opportunities
5. **Advanced Features**: Commissioner tools, league analytics

## Security & Performance

### Security Measures
- Auth0 integration for secure authentication
- Environment variable protection for API keys
- MongoDB connection with proper access controls
- Input validation and sanitization

### Performance Optimizations
- Zustand state management for efficient re-renders
- MongoDB connection caching
- Strategic API data caching
- Lazy loading for large component trees
- Optimized bundle size with Next.js 15

## Development Guidelines

### Sport-Agnostic Development
```javascript
// Example: Sport-agnostic component design
const PlayerCard = ({ player, sport }) => {
  const sportConfig = SPORT_CONFIGS[sport];
  const displayStats = sportConfig.primaryStats;
  
  return (
    <div>
      {displayStats.map(stat => (
        <StatDisplay key={stat} value={player.stats[stat]} />
      ))}
    </div>
  );
};
```

### Configuration-Driven Design
```javascript
// Sport configurations centralized
const SPORT_CONFIGS = {
  nba: {
    primaryStats: ['PTS', 'REB', 'AST'],
    comparisonPools: { /* ... */ },
    categories: { /* ... */ }
  },
  nfl: { /* ... */ },
  mlb: { /* ... */ }
};
```

## Future Technical Enhancements

### Planned Infrastructure Improvements
1. **Microservices Architecture**: Separate data processing services
2. **Real-time Updates**: WebSocket integration for live scoring
3. **Machine Learning**: AI-powered trade recommendations
4. **Mobile App**: React Native companion application
5. **API Gateway**: Centralized external API management

### Scalability Considerations
- Database sharding by sport/league
- CDN integration for static assets
- Caching layer (Redis) for frequently accessed data
- Load balancing for high-traffic periods

## Conclusion

Playbook represents a sophisticated fantasy sports platform that balances current functionality with ambitious future expansion. The sport-agnostic architecture ensures scalability across multiple sports while maintaining the flexibility to add sport-specific optimizations. The comprehensive state management, robust data processing pipeline, and modular component architecture position the platform for significant growth and feature enhancement.

The current foundation supports the immediate needs of fantasy sports enthusiasts while the planned roadmap addresses advanced features like multi-platform integration, AI-powered insights, and comprehensive league management tools.