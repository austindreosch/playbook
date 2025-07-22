# League Import Architecture Plan

## 📋 Overview

This document outlines the complete architecture for implementing a robust, modular league import system for the Playbook fantasy sports toolkit. The system is designed to support multiple platforms (Fantrax, Sleeper, ESPN, Yahoo), multiple sports (NBA, NFL, MLB), and complete data storage with ongoing synchronization capabilities.

## 🎯 Core Design Principles

- **Platform Agnostic**: Support multiple fantasy platforms with pluggable adapters
- **Sport Agnostic**: Work across NBA, NFL, MLB with sport-specific processors
- **Complete Data Storage**: Save all raw league data, not just selected pieces
- **Zustand Integration**: Follow existing store patterns for consistent data flow
- **Modular Components**: Reusable UI components across platforms and sports
- **Future-Proof**: Easy to extend with new platforms and sports

## 🏗️ System Architecture

### Data Flow Architecture
```
Platform API → Platform Adapter → Raw Data Store → Sport Processor → Normalized Data → Database
                                      ↓
                              Zustand Store → UI Components
```

### Core Components Structure
```
stores/
├── useLeagueImport.js          # Main import orchestration store
├── useImportedLeagues.js       # Manage saved leagues (like useMasterDataset)
└── useLeagueSync.js            # Handle ongoing synchronization

lib/
├── platformAdapters/
│   ├── basePlatformAdapter.js  # Abstract base class
│   ├── fantraxAdapter.js       # Fantrax API integration
│   ├── sleeperAdapter.js       # Sleeper API integration
│   ├── espnAdapter.js          # ESPN API integration
│   └── yahooAdapter.js         # Yahoo API integration
├── leagueProcessors/
│   ├── rawDataProcessor.js     # Clean/normalize raw platform data
│   ├── nbaLeagueProcessor.js   # NBA-specific league processing
│   ├── nflLeagueProcessor.js   # NFL-specific league processing
│   └── mlbLeagueProcessor.js   # MLB-specific league processing
├── leagueValidation.js         # Schema validation for league data
└── leagueUtils.js              # Common utilities

components/
├── import/
│   ├── ImportLeagueWizard.js   # Main multi-step import form
│   ├── PlatformDetection.js    # Auto-detect platform from URL/ID
│   ├── LeaguePreview.js        # Show detected league info
│   ├── TeamSelection.js        # Select user's team
│   └── ImportProgress.js       # Real-time import progress
└── league/
    ├── LeagueCard.js           # Display imported league summary
    ├── LeagueSyncStatus.js     # Show sync status and controls
    └── LeagueSettings.js       # Manage league preferences

pages/api/
├── import/
│   ├── detect-platform.js     # Auto-detect platform from input
│   ├── import-league.js        # Full league import endpoint
│   └── validate-league.js     # Validate league before import
├── leagues/
│   ├── [id]/
│   │   ├── sync.js             # Sync specific league
│   │   ├── data.js             # Get league data
│   │   └── settings.js         # Update league settings
│   └── index.js                # CRUD for all user leagues
```

---

## 🗂️ Data Schema Design

### Raw League Data Structure
```javascript
{
  // Platform-agnostic metadata
  leagueId: "user_platform_leagueId",
  platform: "fantrax|sleeper|espn|yahoo",
  sport: "nba|nfl|mlb",
  userId: "auth0_user_id",
  
  // League basic info
  leagueInfo: {
    name: "League Name",
    season: "2024",
    format: "dynasty|redraft",
    scoring: "categories|points|h2h",
    teams: 12,
    userTeamId: "team_123"
  },
  
  // Complete raw platform data
  rawData: {
    // Store everything from platform API
    // Platform-specific structure preserved
    teams: [...],
    rosters: [...],
    settings: {...},
    standings: [...],
    schedule: [...],
    transactions: [...],
    // etc.
  },
  
  // Processed/normalized data
  processedData: {
    teams: [
      {
        teamId: "team_123",
        teamName: "Team Name",
        isUserTeam: true,
        players: [
          {
            platformPlayerId: "fantrax_123",
            playbookPlayerId: "pb_456", // Link to master dataset
            name: "Player Name",
            position: "PG",
            team: "LAL",
            status: "active|bench|ir|na",
            // Additional normalized fields
          }
        ]
      }
    ],
    settings: {
      // Normalized settings across platforms
      rosterPositions: ["PG", "SG", "SF", "PF", "C", "UTIL", "BN"],
      scoringCategories: ["PTS", "REB", "AST", "STL", "BLK", "FG%", "FT%", "3PM", "TO"],
      rosterSizes: {
        total: 15,
        active: 10,
        bench: 5,
        ir: 2
      },
      // etc.
    }
  },
  
  // Sync metadata
  syncInfo: {
    lastSync: "2024-01-15T10:00:00Z",
    syncStatus: "success|error|pending",
    syncErrors: [],
    autoSync: true,
    syncSchedule: "daily|weekly|manual",
    nextSync: "2024-01-16T10:00:00Z"
  },
  
  // Timestamps
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

---

## 📦 Detailed File Specifications

### Zustand Stores

#### `stores/useLeagueImport.js`
Main orchestration store for the import process.

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLeagueImport = create(
  persist(
    (set, get) => ({
      // ========================================================================
      // STATE STRUCTURE
      // ========================================================================
      
      // Import Progress & Status
      importStatus: 'idle', // 'idle' | 'detecting' | 'importing' | 'processing' | 'complete' | 'error'
      currentStep: null,
      progress: {
        current: 0,
        total: 0,
        message: ''
      },
      
      // Platform Detection
      detectedPlatform: null, // 'sleeper' | 'espn' | 'yahoo' | 'fantrax' | null
      platformData: {
        sleeper: {
          leagueId: null,
          leagueData: null,
          rosters: [],
          users: [],
          lastFetched: null
        },
        espn: {
          leagueId: null,
          season: null,
          leagueData: null,
          teams: [],
          lastFetched: null
        },
        fantrax: {
          leagueId: null,
          leagueData: null,
          teams: [],
          lastFetched: null
        },
        yahoo: {
          leagueId: null,
          accessToken: null,
          leagueData: null,
          teams: [],
          lastFetched: null
        }
      },
      
      // Processed League Data
      processedLeague: {
        leagueDetails: {},
        standings: {},
        rosters: [],
        settings: {},
        players: []
      },
      
      // Error Handling
      error: {
        detection: null,
        import: null,
        processing: null
      },
      
      // Loading States
      loading: {
        detection: false,
        import: false,
        processing: false,
        saving: false
      },
      
      // Import Configuration
      importConfig: {
        includeHistoricalData: true,
        syncPlayers: true,
        createUserTeam: true,
        selectedTeamId: null,
        autoSync: true,
        syncSchedule: 'daily'
      },
      
      // ========================================================================
      // ACTIONS
      // ========================================================================
      
      // Platform Detection
      detectPlatformFromUrl: async (url) => {
        set(state => ({
          importStatus: 'detecting',
          loading: { ...state.loading, detection: true },
          error: { ...state.error, detection: null }
        }));
        
        try {
          const response = await fetch('/api/import/detect-platform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          
          const result = await response.json();
          
          if (result.success) {
            set(state => ({
              detectedPlatform: result.platform,
              platformData: {
                ...state.platformData,
                [result.platform]: {
                  ...state.platformData[result.platform],
                  leagueId: result.leagueId
                }
              },
              loading: { ...state.loading, detection: false }
            }));
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set(state => ({
            error: { ...state.error, detection: error.message },
            loading: { ...state.loading, detection: false },
            importStatus: 'error'
          }));
        }
      },
      
      // Data Import
      importLeagueData: async (platform, config) => {
        set(state => ({
          importStatus: 'importing',
          loading: { ...state.loading, import: true },
          error: { ...state.error, import: null },
          importConfig: { ...state.importConfig, ...config }
        }));
        
        try {
          const { leagueId } = get().platformData[platform];
          
          const response = await fetch('/api/import/import-league', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform,
              leagueId,
              config: get().importConfig
            })
          });
          
          const result = await response.json();
          
          if (result.success) {
            set(state => ({
              processedLeague: result.leagueData,
              importStatus: 'complete',
              loading: { ...state.loading, import: false }
            }));
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set(state => ({
            error: { ...state.error, import: error.message },
            loading: { ...state.loading, import: false },
            importStatus: 'error'
          }));
        }
      },
      
      // Configuration Updates
      setImportConfig: (updates) => {
        set(state => ({
          importConfig: { ...state.importConfig, ...updates }
        }));
      },
      
      setSelectedTeam: (teamId) => {
        set(state => ({
          importConfig: { ...state.importConfig, selectedTeamId: teamId }
        }));
      },
      
      // Selectors
      getImportProgress: () => {
        const { progress, importStatus } = get();
        return {
          ...progress,
          status: importStatus,
          percentage: progress.total > 0 ? (progress.current / progress.total) * 100 : 0
        };
      },
      
      getPlatformData: (platform) => {
        return get().platformData[platform] || null;
      },
      
      // Reset
      resetImport: () => {
        set({
          importStatus: 'idle',
          currentStep: null,
          progress: { current: 0, total: 0, message: '' },
          detectedPlatform: null,
          processedLeague: {
            leagueDetails: {},
            standings: {},
            rosters: [],
            settings: {},
            players: []
          },
          error: {
            detection: null,
            import: null,
            processing: null
          },
          loading: {
            detection: false,
            import: false,
            processing: false,
            saving: false
          }
        });
      }
    }),
    {
      name: 'league-import-storage',
      partialize: (state) => ({
        importConfig: state.importConfig,
        detectedPlatform: state.detectedPlatform
      })
    }
  )
);

export default useLeagueImport;
```

#### `stores/useImportedLeagues.js`
Manage all imported leagues similar to useMasterDataset pattern.

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useImportedLeagues = create(
  persist(
    (set, get) => ({
      // ========================================================================
      // STATE STRUCTURE
      // ========================================================================
      
      // Leagues data organized by sport
      leagues: {
        nba: [],
        nfl: [],
        mlb: []
      },
      
      // Active/selected league
      activeLeague: null,
      
      // Loading states
      loading: {
        fetch: false,
        sync: false,
        delete: false
      },
      
      // Error states
      error: {
        fetch: null,
        sync: null,
        delete: null
      },
      
      // Last updated timestamps
      lastUpdated: {
        nba: null,
        nfl: null,
        mlb: null
      },
      
      // ========================================================================
      // ACTIONS
      // ========================================================================
      
      // Fetch all user leagues
      fetchUserLeagues: async () => {
        set(state => ({
          loading: { ...state.loading, fetch: true },
          error: { ...state.error, fetch: null }
        }));
        
        try {
          const response = await fetch('/api/leagues');
          const result = await response.json();
          
          if (result.success) {
            const leaguesBySport = {
              nba: result.leagues.filter(l => l.sport === 'nba'),
              nfl: result.leagues.filter(l => l.sport === 'nfl'),
              mlb: result.leagues.filter(l => l.sport === 'mlb')
            };
            
            set({
              leagues: leaguesBySport,
              loading: { ...get().loading, fetch: false },
              lastUpdated: {
                nba: new Date().toISOString(),
                nfl: new Date().toISOString(),
                mlb: new Date().toISOString()
              }
            });
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set(state => ({
            error: { ...state.error, fetch: error.message },
            loading: { ...state.loading, fetch: false }
          }));
        }
      },
      
      // Sync specific league
      syncLeague: async (leagueId) => {
        set(state => ({
          loading: { ...state.loading, sync: true },
          error: { ...state.error, sync: null }
        }));
        
        try {
          const response = await fetch(`/api/leagues/${leagueId}/sync`, {
            method: 'POST'
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Update the specific league in state
            set(state => {
              const updatedLeagues = { ...state.leagues };
              Object.keys(updatedLeagues).forEach(sport => {
                const leagueIndex = updatedLeagues[sport].findIndex(l => l.leagueId === leagueId);
                if (leagueIndex !== -1) {
                  updatedLeagues[sport][leagueIndex] = result.league;
                }
              });
              
              return {
                leagues: updatedLeagues,
                loading: { ...state.loading, sync: false }
              };
            });
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set(state => ({
            error: { ...state.error, sync: error.message },
            loading: { ...state.loading, sync: false }
          }));
        }
      },
      
      // Sync all leagues
      syncAllLeagues: async () => {
        const allLeagues = Object.values(get().leagues).flat();
        for (const league of allLeagues) {
          await get().syncLeague(league.leagueId);
        }
      },
      
      // Delete league
      deleteLeague: async (leagueId) => {
        set(state => ({
          loading: { ...state.loading, delete: true },
          error: { ...state.error, delete: null }
        }));
        
        try {
          const response = await fetch(`/api/leagues/${leagueId}`, {
            method: 'DELETE'
          });
          
          const result = await response.json();
          
          if (result.success) {
            set(state => {
              const updatedLeagues = { ...state.leagues };
              Object.keys(updatedLeagues).forEach(sport => {
                updatedLeagues[sport] = updatedLeagues[sport].filter(l => l.leagueId !== leagueId);
              });
              
              return {
                leagues: updatedLeagues,
                loading: { ...state.loading, delete: false },
                activeLeague: state.activeLeague?.leagueId === leagueId ? null : state.activeLeague
              };
            });
          } else {
            throw new Error(result.error);
          }
        } catch (error) {
          set(state => ({
            error: { ...state.error, delete: error.message },
            loading: { ...state.loading, delete: false }
          }));
        }
      },
      
      // Set active league
      setActiveLeague: (leagueId) => {
        const allLeagues = Object.values(get().leagues).flat();
        const league = allLeagues.find(l => l.leagueId === leagueId);
        set({ activeLeague: league });
      },
      
      // Selectors
      getLeaguesBySport: (sport) => {
        return get().leagues[sport] || [];
      },
      
      getLeaguesByPlatform: (platform) => {
        const allLeagues = Object.values(get().leagues).flat();
        return allLeagues.filter(l => l.platform === platform);
      },
      
      getAllLeagues: () => {
        return Object.values(get().leagues).flat();
      },
      
      getActiveLeague: () => {
        return get().activeLeague;
      }
    }),
    {
      name: 'imported-leagues-storage',
      partialize: (state) => ({
        activeLeague: state.activeLeague
      })
    }
  )
);

export default useImportedLeagues;
```

#### `stores/useLeagueSync.js`
Handle ongoing synchronization of league data.

```javascript
import { create } from 'zustand';

const useLeagueSync = create((set, get) => ({
  // ========================================================================
  // STATE STRUCTURE
  // ========================================================================
  
  // Sync jobs and scheduling
  syncJobs: {},
  activeSyncs: new Set(),
  
  // Sync statistics
  syncStats: {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    lastSyncTime: null
  },
  
  // Auto-sync settings
  autoSyncEnabled: true,
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours in ms
  
  // ========================================================================
  // ACTIONS
  // ========================================================================
  
  // Start auto-sync for a league
  startAutoSync: (leagueId, interval = null) => {
    const syncInterval = interval || get().syncInterval;
    
    const syncJob = setInterval(async () => {
      if (!get().activeSyncs.has(leagueId)) {
        await get().syncLeague(leagueId);
      }
    }, syncInterval);
    
    set(state => ({
      syncJobs: {
        ...state.syncJobs,
        [leagueId]: syncJob
      }
    }));
  },
  
  // Stop auto-sync for a league
  stopAutoSync: (leagueId) => {
    const { syncJobs } = get();
    if (syncJobs[leagueId]) {
      clearInterval(syncJobs[leagueId]);
      set(state => ({
        syncJobs: {
          ...state.syncJobs,
          [leagueId]: undefined
        }
      }));
    }
  },
  
  // Manual sync with progress tracking
  syncLeague: async (leagueId) => {
    set(state => ({
      activeSyncs: new Set([...state.activeSyncs, leagueId])
    }));
    
    try {
      const response = await fetch(`/api/leagues/${leagueId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        set(state => ({
          syncStats: {
            ...state.syncStats,
            totalSyncs: state.syncStats.totalSyncs + 1,
            successfulSyncs: state.syncStats.successfulSyncs + 1,
            lastSyncTime: new Date().toISOString()
          }
        }));
      } else {
        set(state => ({
          syncStats: {
            ...state.syncStats,
            totalSyncs: state.syncStats.totalSyncs + 1,
            failedSyncs: state.syncStats.failedSyncs + 1
          }
        }));
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Sync failed for league ${leagueId}:`, error);
    } finally {
      set(state => ({
        activeSyncs: new Set([...state.activeSyncs].filter(id => id !== leagueId))
      }));
    }
  },
  
  // Bulk sync operations
  syncMultipleLeagues: async (leagueIds) => {
    const promises = leagueIds.map(id => get().syncLeague(id));
    await Promise.allSettled(promises);
  },
  
  // Configuration
  setAutoSyncEnabled: (enabled) => {
    set({ autoSyncEnabled: enabled });
  },
  
  setSyncInterval: (interval) => {
    set({ syncInterval: interval });
    
    // Restart all active sync jobs with new interval
    const { syncJobs } = get();
    Object.keys(syncJobs).forEach(leagueId => {
      if (syncJobs[leagueId]) {
        get().stopAutoSync(leagueId);
        get().startAutoSync(leagueId, interval);
      }
    });
  },
  
  // Selectors
  isSyncing: (leagueId) => {
    return get().activeSyncs.has(leagueId);
  },
  
  getSyncStats: () => {
    return get().syncStats;
  }
}));

export default useLeagueSync;
```

---

### Platform Adapters

#### `lib/platformAdapters/basePlatformAdapter.js`
Abstract base class defining the standard interface.

```javascript
/**
 * Abstract base class for all platform adapters
 * Defines the standard interface that all platform integrations must implement
 */
export class BasePlatformAdapter {
  constructor(config = {}) {
    this.config = config;
    this.platform = 'base';
    this.supportedSports = [];
  }
  
  /**
   * Detect if the provided input (URL/ID) belongs to this platform
   * @param {string} input - URL or league ID
   * @returns {Promise<{isValid: boolean, leagueId?: string, sport?: string}>}
   */
  async detectLeague(input) {
    throw new Error('detectLeague method must be implemented by subclass');
  }
  
  /**
   * Fetch basic league information for preview purposes
   * @param {string} leagueId - League identifier
   * @returns {Promise<Object>} Basic league info
   */
  async fetchLeaguePreview(leagueId) {
    throw new Error('fetchLeaguePreview method must be implemented by subclass');
  }
  
  /**
   * Fetch complete league data including all teams, rosters, settings
   * @param {string} leagueId - League identifier
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Complete league data
   */
  async fetchCompleteLeagueData(leagueId, options = {}) {
    throw new Error('fetchCompleteLeagueData method must be implemented by subclass');
  }
  
  /**
   * Validate authentication/credentials for this platform
   * @param {Object} credentials - Platform-specific credentials
   * @returns {Promise<boolean>} Validation result
   */
  async validateCredentials(credentials) {
    throw new Error('validateCredentials method must be implemented by subclass');
  }
  
  /**
   * Normalize team data to standard format
   * @param {Object} rawTeam - Raw team data from platform
   * @returns {Object} Normalized team data
   */
  normalizeTeamData(rawTeam) {
    return {
      teamId: rawTeam.id || rawTeam.teamId,
      teamName: rawTeam.name || rawTeam.teamName,
      ownerName: rawTeam.owner || rawTeam.ownerName,
      isUserTeam: false,
      players: []
    };
  }
  
  /**
   * Normalize player data to standard format
   * @param {Object} rawPlayer - Raw player data from platform
   * @returns {Object} Normalized player data
   */
  normalizePlayerData(rawPlayer) {
    return {
      platformPlayerId: rawPlayer.id,
      name: rawPlayer.name,
      position: rawPlayer.position,
      team: rawPlayer.team,
      status: rawPlayer.status || 'active'
    };
  }
  
  /**
   * Parse league settings to standard format
   * @param {Object} rawSettings - Raw settings from platform
   * @returns {Object} Normalized settings
   */
  normalizeSettings(rawSettings) {
    return {
      rosterPositions: [],
      scoringCategories: [],
      rosterSizes: {
        total: 0,
        active: 0,
        bench: 0,
        ir: 0
      }
    };
  }
  
  /**
   * Handle platform-specific errors
   * @param {Error} error - Original error
   * @returns {Error} Normalized error
   */
  handleError(error) {
    return new Error(`${this.platform} API Error: ${error.message}`);
  }
}
```

#### `lib/platformAdapters/fantraxAdapter.js`
Fantrax platform implementation.

```javascript
import axios from 'axios';
import { BasePlatformAdapter } from './basePlatformAdapter.js';

export class FantraxAdapter extends BasePlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.platform = 'fantrax';
    this.supportedSports = ['nba', 'nfl', 'mlb'];
    this.baseUrl = 'https://www.fantrax.com/fxea/general';
  }
  
  async detectLeague(input) {
    // Fantrax league URL pattern: https://www.fantrax.com/fantasy/league/[leagueId]
    const urlPattern = /fantrax\.com\/fantasy\/league\/([a-zA-Z0-9]+)/;
    const idPattern = /^[a-zA-Z0-9]{8,}$/; // Direct league ID
    
    let leagueId = null;
    
    if (urlPattern.test(input)) {
      const match = input.match(urlPattern);
      leagueId = match[1];
    } else if (idPattern.test(input)) {
      leagueId = input;
    }
    
    if (!leagueId) {
      return { isValid: false };
    }
    
    try {
      // Validate by attempting to fetch basic league info
      const response = await axios.get(`${this.baseUrl}/getLeagueInfo?leagueId=${leagueId}`);
      
      if (response.data && response.data.leagueInfo) {
        // Determine sport based on league settings
        const sport = this.determineSport(response.data);
        
        return {
          isValid: true,
          leagueId,
          sport
        };
      }
      
      return { isValid: false };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
  
  async fetchLeaguePreview(leagueId) {
    try {
      const [leagueInfoResponse, rostersResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/getLeagueInfo?leagueId=${leagueId}`),
        axios.get(`${this.baseUrl}/getTeamRosters?leagueId=${leagueId}`)
      ]);
      
      const leagueInfo = leagueInfoResponse.data;
      const rosters = rostersResponse.data.rosters;
      
      return {
        leagueId,
        name: leagueInfo.leagueInfo?.leagueName || 'Unknown League',
        sport: this.determineSport(leagueInfo),
        platform: this.platform,
        teamCount: Object.keys(rosters).length,
        teams: Object.entries(rosters).map(([teamId, teamData]) => ({
          teamId,
          teamName: teamData.teamName,
          playerCount: teamData.rosterItems?.length || 0
        }))
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async fetchCompleteLeagueData(leagueId, options = {}) {
    try {
      const sport = options.sport || 'NBA'; // Default to NBA for backwards compatibility
      
      const [leagueInfoResponse, rostersResponse, playerDataResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/getLeagueInfo?leagueId=${leagueId}`),
        axios.get(`${this.baseUrl}/getTeamRosters?leagueId=${leagueId}`),
        axios.get(`${this.baseUrl}/getPlayerIds?sport=${sport.toUpperCase()}`)
      ]);
      
      const leagueInfo = leagueInfoResponse.data;
      const rosters = rostersResponse.data.rosters;
      const playerDataMap = playerDataResponse.data;
      
      // Build complete league data structure
      const teams = [];
      
      for (const [teamId, teamData] of Object.entries(rosters)) {
        const players = [];
        
        if (Array.isArray(teamData.rosterItems)) {
          teamData.rosterItems.forEach(item => {
            const playerData = playerDataMap[item.id];
            if (playerData) {
              players.push(this.normalizePlayerData({
                ...playerData,
                status: item.status,
                position: item.position || playerData.position
              }));
            }
          });
        }
        
        teams.push({
          ...this.normalizeTeamData(teamData),
          teamId,
          players
        });
      }
      
      return {
        platform: this.platform,
        leagueId,
        sport: this.determineSport(leagueInfo),
        rawData: {
          leagueInfo: leagueInfo,
          rosters: rosters,
          playerData: playerDataMap
        },
        processedData: {
          leagueDetails: {
            name: leagueInfo.leagueInfo?.leagueName || 'Unknown League',
            season: new Date().getFullYear().toString(),
            format: this.determineFormat(leagueInfo),
            scoring: this.determineScoring(leagueInfo)
          },
          teams,
          settings: this.normalizeSettings(leagueInfo)
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async validateCredentials(credentials) {
    // Fantrax doesn't require special authentication for public league data
    return true;
  }
  
  normalizePlayerData(rawPlayer) {
    const cleanedName = rawPlayer.name ? 
      rawPlayer.name.split(', ').reverse().join(' ') : 
      'Unknown Player';
    
    return {
      platformPlayerId: rawPlayer.fantraxId || rawPlayer.id,
      name: cleanedName,
      position: rawPlayer.position,
      team: rawPlayer.team,
      status: rawPlayer.status || 'active',
      rotowireId: rawPlayer.rotowireId
    };
  }
  
  normalizeSettings(leagueInfo) {
    const rosterInfo = leagueInfo.rosterInfo || {};
    const positionConstraints = rosterInfo.positionConstraints || {};
    
    const rosterPositions = [];
    for (const [position, constraint] of Object.entries(positionConstraints)) {
      for (let i = 0; i < (constraint.maxActive || 0); i++) {
        rosterPositions.push(position);
      }
    }
    
    return {
      rosterPositions,
      scoringCategories: this.extractScoringCategories(leagueInfo),
      rosterSizes: {
        total: rosterInfo.maxTotalPlayers || 0,
        active: rosterInfo.maxTotalActivePlayers || 0,
        bench: (rosterInfo.maxTotalPlayers || 0) - (rosterInfo.maxTotalActivePlayers || 0),
        ir: rosterInfo.maxInjuredReservePlayers || 0
      }
    };
  }
  
  // Helper methods
  determineSport(leagueInfo) {
    // Logic to determine sport from league settings
    // This is a simplified version - you'd implement proper detection
    return 'nba'; // Default for now
  }
  
  determineFormat(leagueInfo) {
    // Logic to determine if dynasty or redraft
    return 'redraft'; // Default for now
  }
  
  determineScoring(leagueInfo) {
    // Logic to determine scoring type
    return 'categories'; // Default for now
  }
  
  extractScoringCategories(leagueInfo) {
    // Extract actual scoring categories from league settings
    return ['PTS', 'REB', 'AST', 'STL', 'BLK', 'FG%', 'FT%', '3PM', 'TO'];
  }
}
```

#### `lib/platformAdapters/sleeperAdapter.js`
Sleeper platform implementation.

```javascript
import axios from 'axios';
import { BasePlatformAdapter } from './basePlatformAdapter.js';

export class SleeperAdapter extends BasePlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.platform = 'sleeper';
    this.supportedSports = ['nfl', 'nba'];
    this.baseUrl = 'https://api.sleeper.app/v1';
  }
  
  async detectLeague(input) {
    // Sleeper league URL pattern: https://sleeper.app/leagues/[leagueId]
    const urlPattern = /sleeper\.app\/leagues\/(\d+)/;
    const idPattern = /^\d{15,}$/; // Sleeper league IDs are long numbers
    
    let leagueId = null;
    
    if (urlPattern.test(input)) {
      const match = input.match(urlPattern);
      leagueId = match[1];
    } else if (idPattern.test(input)) {
      leagueId = input;
    }
    
    if (!leagueId) {
      return { isValid: false };
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/league/${leagueId}`);
      
      if (response.data && response.data.league_id) {
        return {
          isValid: true,
          leagueId,
          sport: response.data.sport || 'nfl'
        };
      }
      
      return { isValid: false };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
  
  async fetchLeaguePreview(leagueId) {
    try {
      const [leagueResponse, usersResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/league/${leagueId}`),
        axios.get(`${this.baseUrl}/league/${leagueId}/users`)
      ]);
      
      const league = leagueResponse.data;
      const users = usersResponse.data;
      
      return {
        leagueId,
        name: league.name,
        sport: league.sport,
        platform: this.platform,
        teamCount: league.total_rosters,
        teams: users.map(user => ({
          teamId: user.user_id,
          teamName: user.display_name,
          playerCount: 0 // Would need roster data to get accurate count
        }))
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async fetchCompleteLeagueData(leagueId, options = {}) {
    try {
      const [leagueResponse, usersResponse, rostersResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/league/${leagueId}`),
        axios.get(`${this.baseUrl}/league/${leagueId}/users`),
        axios.get(`${this.baseUrl}/league/${leagueId}/rosters`)
      ]);
      
      const league = leagueResponse.data;
      const users = usersResponse.data;
      const rosters = rostersResponse.data;
      
      // Create user lookup map
      const userMap = {};
      users.forEach(user => {
        userMap[user.user_id] = user;
      });
      
      // Process teams and rosters
      const teams = rosters.map(roster => {
        const owner = userMap[roster.owner_id];
        
        return {
          teamId: roster.roster_id.toString(),
          teamName: owner?.metadata?.team_name || owner?.display_name || 'Unknown Team',
          ownerName: owner?.display_name || 'Unknown Owner',
          isUserTeam: false, // Will be set based on user selection
          players: (roster.players || []).map(playerId => ({
            platformPlayerId: playerId,
            name: 'Unknown Player', // Would need player data API call
            position: 'Unknown',
            team: 'Unknown',
            status: 'active'
          }))
        };
      });
      
      return {
        platform: this.platform,
        leagueId,
        sport: league.sport,
        rawData: {
          league,
          users,
          rosters
        },
        processedData: {
          leagueDetails: {
            name: league.name,
            season: league.season,
            format: league.settings?.type === 2 ? 'dynasty' : 'redraft',
            scoring: league.scoring_settings ? 'points' : 'unknown'
          },
          teams,
          settings: this.normalizeSettings(league)
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  normalizeSettings(league) {
    const settings = league.settings || {};
    const rosterPositions = [];
    
    // Build roster positions from Sleeper settings
    if (settings.roster_positions) {
      settings.roster_positions.forEach(position => {
        rosterPositions.push(position);
      });
    }
    
    return {
      rosterPositions,
      scoringCategories: Object.keys(league.scoring_settings || {}),
      rosterSizes: {
        total: settings.roster_positions?.length || 0,
        active: settings.roster_positions?.filter(p => p !== 'BN').length || 0,
        bench: settings.roster_positions?.filter(p => p === 'BN').length || 0,
        ir: settings.roster_positions?.filter(p => p === 'IR').length || 0
      }
    };
  }
}
```

---

### League Processors

#### `lib/leagueProcessors/rawDataProcessor.js`
Clean and normalize raw platform data.

```javascript
/**
 * Raw data processor for cleaning and normalizing platform data
 * before sport-specific processing
 */

export class RawDataProcessor {
  constructor() {
    this.supportedPlatforms = ['fantrax', 'sleeper', 'espn', 'yahoo'];
  }
  
  /**
   * Process raw league data from any platform
   * @param {Object} rawData - Raw data from platform adapter
   * @returns {Object} Cleaned and normalized data
   */
  processRawData(rawData) {
    const { platform, sport } = rawData;
    
    if (!this.supportedPlatforms.includes(platform)) {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    const processor = this.getProcessorForPlatform(platform);
    return processor.process(rawData);
  }
  
  /**
   * Get platform-specific processor
   * @param {string} platform - Platform name
   * @returns {Object} Platform processor
   */
  getProcessorForPlatform(platform) {
    switch (platform) {
      case 'fantrax':
        return new FantraxDataProcessor();
      case 'sleeper':
        return new SleeperDataProcessor();
      case 'espn':
        return new ESPNDataProcessor();
      case 'yahoo':
        return new YahooDataProcessor();
      default:
        throw new Error(`No processor found for platform: ${platform}`);
    }
  }
}

/**
 * Fantrax-specific data processor
 */
class FantraxDataProcessor {
  process(rawData) {
    return {
      ...rawData,
      processedData: {
        ...rawData.processedData,
        teams: this.processTeams(rawData.rawData.rosters, rawData.rawData.playerData),
        settings: this.processSettings(rawData.rawData.leagueInfo),
        leagueDetails: this.processLeagueDetails(rawData.rawData.leagueInfo)
      }
    };
  }
  
  processTeams(rosters, playerData) {
    const teams = [];
    
    for (const [teamId, teamData] of Object.entries(rosters)) {
      const players = [];
      
      if (Array.isArray(teamData.rosterItems)) {
        teamData.rosterItems.forEach(item => {
          const playerInfo = playerData[item.id];
          if (playerInfo) {
            players.push({
              platformPlayerId: playerInfo.fantraxId,
              name: this.cleanPlayerName(playerInfo.name),
              position: item.position || playerInfo.position,
              team: playerInfo.team,
              status: item.status || 'active',
              rotowireId: playerInfo.rotowireId
            });
          }
        });
      }
      
      teams.push({
        teamId,
        teamName: teamData.teamName,
        ownerName: teamData.ownerName || 'Unknown',
        isUserTeam: false,
        players
      });
    }
    
    return teams;
  }
  
  processSettings(leagueInfo) {
    const rosterInfo = leagueInfo.rosterInfo || {};
    const positionConstraints = rosterInfo.positionConstraints || {};
    
    const rosterPositions = [];
    for (const [position, constraint] of Object.entries(positionConstraints)) {
      for (let i = 0; i < (constraint.maxActive || 0); i++) {
        rosterPositions.push(position);
      }
    }
    
    return {
      rosterPositions,
      scoringCategories: this.extractScoringCategories(leagueInfo),
      rosterSizes: {
        total: rosterInfo.maxTotalPlayers || 0,
        active: rosterInfo.maxTotalActivePlayers || 0,
        bench: (rosterInfo.maxTotalPlayers || 0) - (rosterInfo.maxTotalActivePlayers || 0),
        ir: rosterInfo.maxInjuredReservePlayers || 0
      }
    };
  }
  
  processLeagueDetails(leagueInfo) {
    return {
      name: leagueInfo.leagueInfo?.leagueName || 'Unknown League',
      season: new Date().getFullYear().toString(),
      format: this.determineFormat(leagueInfo),
      scoring: this.determineScoring(leagueInfo)
    };
  }
  
  cleanPlayerName(name) {
    if (!name) return 'Unknown Player';
    // Convert "Last, First" to "First Last"
    return name.includes(', ') ? name.split(', ').reverse().join(' ') : name;
  }
  
  extractScoringCategories(leagueInfo) {
    // Extract from league settings - simplified for now
    return ['PTS', 'REB', 'AST', 'STL', 'BLK', 'FG%', 'FT%', '3PM', 'TO'];
  }
  
  determineFormat(leagueInfo) {
    // Logic to determine format - simplified for now
    return 'redraft';
  }
  
  determineScoring(leagueInfo) {
    // Logic to determine scoring type - simplified for now
    return 'categories';
  }
}

/**
 * Sleeper-specific data processor
 */
class SleeperDataProcessor {
  process(rawData) {
    return {
      ...rawData,
      processedData: {
        ...rawData.processedData,
        teams: this.processTeams(rawData.rawData.rosters, rawData.rawData.users),
        settings: this.processSettings(rawData.rawData.league),
        leagueDetails: this.processLeagueDetails(rawData.rawData.league)
      }
    };
  }
  
  processTeams(rosters, users) {
    const userMap = {};
    users.forEach(user => {
      userMap[user.user_id] = user;
    });
    
    return rosters.map(roster => {
      const owner = userMap[roster.owner_id];
      
      return {
        teamId: roster.roster_id.toString(),
        teamName: owner?.metadata?.team_name || owner?.display_name || 'Unknown Team',
        ownerName: owner?.display_name || 'Unknown Owner',
        isUserTeam: false,
        players: (roster.players || []).map(playerId => ({
          platformPlayerId: playerId,
          name: 'Unknown Player', // Would need additional API call
          position: 'Unknown',
          team: 'Unknown',
          status: 'active'
        }))
      };
    });
  }
  
  processSettings(league) {
    const settings = league.settings || {};
    const rosterPositions = settings.roster_positions || [];
    
    return {
      rosterPositions,
      scoringCategories: Object.keys(league.scoring_settings || {}),
      rosterSizes: {
        total: rosterPositions.length,
        active: rosterPositions.filter(p => p !== 'BN' && p !== 'IR').length,
        bench: rosterPositions.filter(p => p === 'BN').length,
        ir: rosterPositions.filter(p => p === 'IR').length
      }
    };
  }
  
  processLeagueDetails(league) {
    return {
      name: league.name,
      season: league.season,
      format: league.settings?.type === 2 ? 'dynasty' : 'redraft',
      scoring: league.scoring_settings ? 'points' : 'unknown'
    };
  }
}

// Placeholder processors for other platforms
class ESPNDataProcessor {
  process(rawData) {
    // TODO: Implement ESPN-specific processing
    return rawData;
  }
}

class YahooDataProcessor {
  process(rawData) {
    // TODO: Implement Yahoo-specific processing
    return rawData;
  }
}
```

#### `lib/leagueProcessors/nbaLeagueProcessor.js`
NBA-specific league processing.

```javascript
/**
 * NBA-specific league processor
 * Handles NBA-specific logic, position mappings, and calculations
 */

export class NBALeagueProcessor {
  constructor() {
    this.sport = 'nba';
    this.positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL', 'BN'];
    this.scoringCategories = ['PTS', 'REB', 'AST', 'STL', 'BLK', 'FG%', 'FT%', '3PM', 'TO'];
  }
  
  /**
   * Process NBA-specific league data
   * @param {Object} rawLeagueData - Raw league data from platform
   * @returns {Object} NBA-processed league data
   */
  processLeagueData(rawLeagueData) {
    return {
      ...rawLeagueData,
      processedData: {
        ...rawLeagueData.processedData,
        teams: this.processTeams(rawLeagueData.processedData.teams),
        settings: this.processSettings(rawLeagueData.processedData.settings),
        playerMappings: this.createPlayerMappings(rawLeagueData.processedData.teams)
      }
    };
  }
  
  /**
   * Process teams with NBA-specific logic
   * @param {Array} teams - Raw team data
   * @returns {Array} Processed teams
   */
  processTeams(teams) {
    return teams.map(team => ({
      ...team,
      players: team.players.map(player => this.processPlayer(player)),
      rosterAnalysis: this.analyzeRoster(team.players)
    }));
  }
  
  /**
   * Process individual player with NBA-specific logic
   * @param {Object} player - Raw player data
   * @returns {Object} Processed player
   */
  processPlayer(player) {
    return {
      ...player,
      position: this.normalizePosition(player.position),
      eligiblePositions: this.getEligiblePositions(player.position),
      team: this.normalizeTeamName(player.team),
      playbookPlayerId: this.generatePlaybookId(player)
    };
  }
  
  /**
   * Process league settings with NBA defaults
   * @param {Object} settings - Raw settings
   * @returns {Object} NBA-specific settings
   */
  processSettings(settings) {
    const processedSettings = {
      ...settings,
      sport: this.sport,
      rosterPositions: this.validateRosterPositions(settings.rosterPositions),
      scoringCategories: this.validateScoringCategories(settings.scoringCategories),
      positionEligibility: this.getPositionEligibilityRules()
    };
    
    // Apply NBA-specific defaults if missing
    if (!processedSettings.rosterPositions.length) {
      processedSettings.rosterPositions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL', 'BN', 'BN', 'BN', 'BN', 'BN'];
    }
    
    if (!processedSettings.scoringCategories.length) {
      processedSettings.scoringCategories = this.scoringCategories;
    }
    
    return processedSettings;
  }
  
  /**
   * Analyze roster composition
   * @param {Array} players - Team players
   * @returns {Object} Roster analysis
   */
  analyzeRoster(players) {
    const positionCounts = {};
    const teamCounts = {};
    
    players.forEach(player => {
      // Count by position
      const position = player.position;
      positionCounts[position] = (positionCounts[position] || 0) + 1;
      
      // Count by NBA team
      const team = player.team;
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });
    
    return {
      totalPlayers: players.length,
      positionCounts,
      teamCounts,
      rosterHealth: this.calculateRosterHealth(players),
      strengthsByPosition: this.analyzePositionStrength(players)
    };
  }
  
  /**
   * Create player ID mappings for integration with master dataset
   * @param {Array} teams - All teams
   * @returns {Object} Player mappings
   */
  createPlayerMappings(teams) {
    const mappings = {};
    
    teams.forEach(team => {
      team.players.forEach(player => {
        const playbookId = this.generatePlaybookId(player);
        mappings[player.platformPlayerId] = {
          playbookPlayerId: playbookId,
          platformPlayerId: player.platformPlayerId,
          name: player.name,
          position: player.position,
          team: player.team
        };
      });
    });
    
    return mappings;
  }
  
  // Helper methods
  
  normalizePosition(position) {
    const positionMap = {
      'PG': 'PG',
      'SG': 'SG', 
      'SF': 'SF',
      'PF': 'PF',
      'C': 'C',
      'G': 'G',
      'F': 'F',
      'UTIL': 'UTIL',
      'BN': 'BN',
      'Bench': 'BN',
      'IL': 'IR',
      'IR': 'IR'
    };
    
    return positionMap[position] || position;
  }
  
  getEligiblePositions(primaryPosition) {
    const eligibilityMap = {
      'PG': ['PG', 'G', 'UTIL'],
      'SG': ['SG', 'G', 'UTIL'],
      'SF': ['SF', 'F', 'UTIL'],
      'PF': ['PF', 'F', 'UTIL'],
      'C': ['C', 'UTIL']
    };
    
    return eligibilityMap[primaryPosition] || ['UTIL'];
  }
  
  normalizeTeamName(team) {
    const teamMap = {
      'LAL': 'LAL',
      'GSW': 'GSW',
      'BOS': 'BOS',
      // Add full team mapping as needed
    };
    
    return teamMap[team] || team;
  }
  
  generatePlaybookId(player) {
    // Create consistent ID for linking with master dataset
    // This would integrate with your existing player ID system
    const cleanName = player.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const teamCode = player.team.toLowerCase();
    return `nba_${cleanName}_${teamCode}`;
  }
  
  validateRosterPositions(positions) {
    if (!Array.isArray(positions)) return [];
    
    return positions.filter(pos => this.positions.includes(pos));
  }
  
  validateScoringCategories(categories) {
    if (!Array.isArray(categories)) return [];
    
    return categories.filter(cat => this.scoringCategories.includes(cat));
  }
  
  getPositionEligibilityRules() {
    return {
      'PG': ['PG', 'G', 'UTIL'],
      'SG': ['SG', 'G', 'UTIL'],
      'SF': ['SF', 'F', 'UTIL'],
      'PF': ['PF', 'F', 'UTIL'],
      'C': ['C', 'UTIL'],
      'G': ['PG', 'SG', 'G', 'UTIL'],
      'F': ['SF', 'PF', 'F', 'UTIL'],
      'UTIL': ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']
    };
  }
  
  calculateRosterHealth(players) {
    const activeCount = players.filter(p => p.status === 'active').length;
    const injuredCount = players.filter(p => p.status === 'injured').length;
    const total = players.length;
    
    return {
      healthScore: total > 0 ? (activeCount / total) * 100 : 0,
      activeCount,
      injuredCount,
      total
    };
  }
  
  analyzePositionStrength(players) {
    // Simplified strength analysis - would integrate with your scoring system
    const strengths = {};
    
    this.positions.forEach(position => {
      const positionPlayers = players.filter(p => 
        this.getEligiblePositions(p.position).includes(position)
      );
      
      strengths[position] = {
        playerCount: positionPlayers.length,
        depth: positionPlayers.length >= 2 ? 'good' : 'needs_depth',
        // Would integrate with actual player rankings/scores
        avgScore: 0
      };
    });
    
    return strengths;
  }
}
```

---

### API Routes

#### `pages/api/import/detect-platform.js`
Auto-detect platform from URL or ID input.

```javascript
import { connectToDatabase } from '../../../lib/mongodb';
import { FantraxAdapter } from '../../../lib/platformAdapters/fantraxAdapter';
import { SleeperAdapter } from '../../../lib/platformAdapters/sleeperAdapter';

/**
 * API route to detect fantasy platform from URL or league ID
 * POST /api/import/detect-platform
 * Body: { url: string }
 * Response: { success: boolean, platform?: string, leagueId?: string, sport?: string, error?: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL or league ID is required' });
    }
    
    // Initialize platform adapters
    const adapters = [
      new FantraxAdapter(),
      new SleeperAdapter()
      // Add other adapters as implemented
    ];
    
    // Try each adapter to detect the platform
    for (const adapter of adapters) {
      try {
        const result = await adapter.detectLeague(url);
        
        if (result.isValid) {
          return res.status(200).json({
            success: true,
            platform: adapter.platform,
            leagueId: result.leagueId,
            sport: result.sport
          });
        }
      } catch (error) {
        console.error(`Error detecting ${adapter.platform}:`, error);
        // Continue to next adapter
      }
    }
    
    // No platform detected
    return res.status(400).json({
      success: false,
      error: 'Unable to detect fantasy platform from the provided URL or ID'
    });
    
  } catch (error) {
    console.error('Platform detection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during platform detection'
    });
  }
}
```

#### `pages/api/import/import-league.js`
Full league import endpoint.

```javascript
import { connectToDatabase } from '../../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import { FantraxAdapter } from '../../../lib/platformAdapters/fantraxAdapter';
import { SleeperAdapter } from '../../../lib/platformAdapters/sleeperAdapter';
import { RawDataProcessor } from '../../../lib/leagueProcessors/rawDataProcessor';
import { NBALeagueProcessor } from '../../../lib/leagueProcessors/nbaLeagueProcessor';

/**
 * API route to import complete league data
 * POST /api/import/import-league
 * Body: { platform: string, leagueId: string, config: object }
 * Response: { success: boolean, leagueData?: object, error?: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const { platform, leagueId, config } = req.body;
    
    if (!platform || !leagueId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Platform and league ID are required' 
      });
    }
    
    // Get platform adapter
    const adapter = getPlatformAdapter(platform);
    if (!adapter) {
      return res.status(400).json({ 
        success: false, 
        error: `Unsupported platform: ${platform}` 
      });
    }
    
    // Step 1: Fetch complete league data from platform
    const rawLeagueData = await adapter.fetchCompleteLeagueData(leagueId, config);
    
    // Step 2: Process raw data
    const rawProcessor = new RawDataProcessor();
    const processedRawData = rawProcessor.processRawData(rawLeagueData);
    
    // Step 3: Apply sport-specific processing
    const sportProcessor = getSportProcessor(processedRawData.sport);
    const finalProcessedData = sportProcessor ? 
      sportProcessor.processLeagueData(processedRawData) : 
      processedRawData;
    
    // Step 4: Prepare final league object for database
    const leagueDocument = {
      leagueId: `${session.user.sub}_${platform}_${leagueId}`,
      platform,
      sport: finalProcessedData.sport,
      userId: session.user.sub,
      providerLeagueId: leagueId,
      
      // League metadata
      leagueInfo: {
        ...finalProcessedData.processedData.leagueDetails,
        teams: finalProcessedData.processedData.teams.length,
        userTeamId: config.selectedTeamId
      },
      
      // Complete raw platform data
      rawData: finalProcessedData.rawData,
      
      // Processed/normalized data
      processedData: finalProcessedData.processedData,
      
      // Sync configuration
      syncInfo: {
        lastSync: new Date().toISOString(),
        syncStatus: 'success',
        syncErrors: [],
        autoSync: config.autoSync || true,
        syncSchedule: config.syncSchedule || 'daily',
        nextSync: calculateNextSync(config.syncSchedule || 'daily')
      },
      
      // Timestamps
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Step 5: Mark user's team
    if (config.selectedTeamId) {
      const userTeam = leagueDocument.processedData.teams.find(
        team => team.teamId === config.selectedTeamId
      );
      if (userTeam) {
        userTeam.isUserTeam = true;
      }
    }
    
    // Step 6: Save to database
    const { db } = await connectToDatabase();
    await db.collection('leagues').insertOne(leagueDocument);
    
    // Step 7: Return success response
    return res.status(200).json({
      success: true,
      leagueData: {
        leagueId: leagueDocument.leagueId,
        name: leagueDocument.leagueInfo.name,
        sport: leagueDocument.sport,
        platform: leagueDocument.platform,
        teams: leagueDocument.processedData.teams.map(team => ({
          teamId: team.teamId,
          teamName: team.teamName,
          isUserTeam: team.isUserTeam,
          playerCount: team.players.length
        }))
      }
    });
    
  } catch (error) {
    console.error('League import error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to import league data'
    });
  }
}

// Helper functions

function getPlatformAdapter(platform) {
  switch (platform) {
    case 'fantrax':
      return new FantraxAdapter();
    case 'sleeper':
      return new SleeperAdapter();
    // Add other platforms as implemented
    default:
      return null;
  }
}

function getSportProcessor(sport) {
  switch (sport) {
    case 'nba':
      return new NBALeagueProcessor();
    // Add other sports as implemented
    case 'nfl':
      // return new NFLLeagueProcessor();
    case 'mlb':
      // return new MLBLeagueProcessor();
    default:
      return null;
  }
}

function calculateNextSync(schedule) {
  const now = new Date();
  
  switch (schedule) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null; // Manual sync only
  }
}
```

#### `pages/api/leagues/index.js`
CRUD operations for user leagues.

```javascript
import { connectToDatabase } from '../../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

/**
 * API route for league CRUD operations
 * GET /api/leagues - Fetch user's leagues
 * POST /api/leagues - Create new league (redirects to import)
 * PUT /api/leagues - Update league settings
 * DELETE /api/leagues - Delete league
 */
export default async function handler(req, res) {
  try {
    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const { db } = await connectToDatabase();
    const userId = session.user.sub;
    
    switch (req.method) {
      case 'GET':
        return await handleGetLeagues(db, userId, req, res);
      case 'PUT':
        return await handleUpdateLeague(db, userId, req, res);
      case 'DELETE':
        return await handleDeleteLeague(db, userId, req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Leagues API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function handleGetLeagues(db, userId, req, res) {
  try {
    const { sport, platform, includeData } = req.query;
    
    // Build query
    const query = { userId };
    if (sport) query.sport = sport;
    if (platform) query.platform = platform;
    
    // Determine projection based on includeData parameter
    const projection = includeData === 'true' 
      ? {} // Include all data
      : {
          // Exclude large data fields for summary view
          'rawData': 0,
          'processedData.teams.players': 0
        };
    
    const leagues = await db.collection('leagues')
      .find(query, { projection })
      .sort({ updatedAt: -1 })
      .toArray();
    
    // Enrich with additional metadata
    const enrichedLeagues = leagues.map(league => ({
      ...league,
      teamCount: league.leagueInfo?.teams || 0,
      syncStatus: league.syncInfo?.syncStatus || 'unknown',
      lastSync: league.syncInfo?.lastSync,
      nextSync: league.syncInfo?.nextSync,
      userTeam: league.processedData?.teams?.find(team => team.isUserTeam)
    }));
    
    return res.status(200).json({
      success: true,
      leagues: enrichedLeagues,
      total: enrichedLeagues.length
    });
    
  } catch (error) {
    console.error('Get leagues error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch leagues'
    });
  }
}

async function handleUpdateLeague(db, userId, req, res) {
  try {
    const { leagueId, updates } = req.body;
    
    if (!leagueId) {
      return res.status(400).json({
        success: false,
        error: 'League ID is required'
      });
    }
    
    // Validate that user owns this league
    const existingLeague = await db.collection('leagues').findOne({
      leagueId,
      userId
    });
    
    if (!existingLeague) {
      return res.status(404).json({
        success: false,
        error: 'League not found'
      });
    }
    
    // Prepare update document
    const updateDoc = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Update league
    const result = await db.collection('leagues').updateOne(
      { leagueId, userId },
      { $set: updateDoc }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        error: 'No changes made to league'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'League updated successfully'
    });
    
  } catch (error) {
    console.error('Update league error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update league'
    });
  }
}

async function handleDeleteLeague(db, userId, req, res) {
  try {
    const { leagueId } = req.body;
    
    if (!leagueId) {
      return res.status(400).json({
        success: false,
        error: 'League ID is required'
      });
    }
    
    // Delete league (only if user owns it)
    const result = await db.collection('leagues').deleteOne({
      leagueId,
      userId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'League not found or not authorized'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'League deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete league error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete league'
    });
  }
}
```

#### `pages/api/leagues/[id]/sync.js`
Sync specific league endpoint.

```javascript
import { connectToDatabase } from '../../../../lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';
import { FantraxAdapter } from '../../../../lib/platformAdapters/fantraxAdapter';
import { SleeperAdapter } from '../../../../lib/platformAdapters/sleeperAdapter';
import { RawDataProcessor } from '../../../../lib/leagueProcessors/rawDataProcessor';
import { NBALeagueProcessor } from '../../../../lib/leagueProcessors/nbaLeagueProcessor';

/**
 * API route to sync specific league data
 * POST /api/leagues/[id]/sync
 * Response: { success: boolean, league?: object, error?: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // Get user session
    const session = await getSession(req, res);
    if (!session?.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const { id: leagueId } = req.query;
    const userId = session.user.sub;
    
    if (!leagueId) {
      return res.status(400).json({ 
        success: false, 
        error: 'League ID is required' 
      });
    }
    
    const { db } = await connectToDatabase();
    
    // Get existing league
    const existingLeague = await db.collection('leagues').findOne({
      leagueId,
      userId
    });
    
    if (!existingLeague) {
      return res.status(404).json({
        success: false,
        error: 'League not found'
      });
    }
    
    // Get platform adapter
    const adapter = getPlatformAdapter(existingLeague.platform);
    if (!adapter) {
      return res.status(400).json({ 
        success: false, 
        error: `Unsupported platform: ${existingLeague.platform}` 
      });
    }
    
    try {
      // Fetch fresh data from platform
      const rawLeagueData = await adapter.fetchCompleteLeagueData(
        existingLeague.providerLeagueId,
        { sport: existingLeague.sport }
      );
      
      // Process the data
      const rawProcessor = new RawDataProcessor();
      const processedRawData = rawProcessor.processRawData(rawLeagueData);
      
      // Apply sport-specific processing
      const sportProcessor = getSportProcessor(processedRawData.sport);
      const finalProcessedData = sportProcessor ? 
        sportProcessor.processLeagueData(processedRawData) : 
        processedRawData;
      
      // Preserve user team selection
      if (existingLeague.leagueInfo.userTeamId) {
        const userTeam = finalProcessedData.processedData.teams.find(
          team => team.teamId === existingLeague.leagueInfo.userTeamId
        );
        if (userTeam) {
          userTeam.isUserTeam = true;
        }
      }
      
      // Update league document
      const updateDoc = {
        rawData: finalProcessedData.rawData,
        processedData: finalProcessedData.processedData,
        'syncInfo.lastSync': new Date().toISOString(),
        'syncInfo.syncStatus': 'success',
        'syncInfo.syncErrors': [],
        'syncInfo.nextSync': calculateNextSync(existingLeague.syncInfo?.syncSchedule || 'daily'),
        updatedAt: new Date().toISOString()
      };
      
      const result = await db.collection('leagues').updateOne(
        { leagueId, userId },
        { $set: updateDoc }
      );
      
      if (result.modifiedCount === 0) {
        throw new Error('Failed to update league in database');
      }
      
      // Get updated league for response
      const updatedLeague = await db.collection('leagues').findOne({
        leagueId,
        userId
      });
      
      return res.status(200).json({
        success: true,
        league: updatedLeague,
        message: 'League synced successfully'
      });
      
    } catch (syncError) {
      // Update sync status with error
      await db.collection('leagues').updateOne(
        { leagueId, userId },
        { 
          $set: {
            'syncInfo.syncStatus': 'error',
            'syncInfo.syncErrors': [syncError.message],
            'syncInfo.lastSync': new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      );
      
      throw syncError;
    }
    
  } catch (error) {
    console.error('League sync error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to sync league data',
      details: error.message
    });
  }
}

// Helper functions (same as import-league.js)
function getPlatformAdapter(platform) {
  switch (platform) {
    case 'fantrax':
      return new FantraxAdapter();
    case 'sleeper':
      return new SleeperAdapter();
    default:
      return null;
  }
}

function getSportProcessor(sport) {
  switch (sport) {
    case 'nba':
      return new NBALeagueProcessor();
    default:
      return null;
  }
}

function calculateNextSync(schedule) {
  const now = new Date();
  
  switch (schedule) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
}
```

---

### UI Components

#### `components/import/ImportLeagueWizard.js`
Main multi-step import form component.

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import useLeagueImport from '@/stores/useLeagueImport';
import PlatformDetection from './PlatformDetection';
import LeaguePreview from './LeaguePreview';
import TeamSelection from './TeamSelection';
import ImportProgress from './ImportProgress';

/**
 * Multi-step league import wizard
 * Steps: Platform Detection → League Preview → Team Selection → Import Progress → Complete
 */
export default function ImportLeagueWizard() {
  const router = useRouter();
  const {
    importStatus,
    detectedPlatform,
    processedLeague,
    error,
    loading,
    importConfig,
    detectPlatformFromUrl,
    importLeagueData,
    setImportConfig,
    resetImport
  } = useLeagueImport();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [urlInput, setUrlInput] = useState('');
  
  const steps = [
    { id: 1, title: 'Platform Detection', description: 'Enter your league URL or ID' },
    { id: 2, title: 'League Preview', description: 'Review league information' },
    { id: 3, title: 'Team Selection', description: 'Select your team' },
    { id: 4, title: 'Import Progress', description: 'Importing league data' },
    { id: 5, title: 'Complete', description: 'Import finished' }
  ];
  
  useEffect(() => {
    // Update current step based on import status
    switch (importStatus) {
      case 'idle':
        setCurrentStep(1);
        break;
      case 'detecting':
        setCurrentStep(1);
        break;
      case 'importing':
        setCurrentStep(4);
        break;
      case 'complete':
        setCurrentStep(5);
        break;
      case 'error':
        // Stay on current step to show error
        break;
    }
  }, [importStatus]);
  
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    await detectPlatformFromUrl(urlInput.trim());
    
    // If detection successful, move to preview step
    if (detectedPlatform && !error.detection) {
      setCurrentStep(2);
    }
  };
  
  const handleLeagueConfirm = () => {
    setCurrentStep(3);
  };
  
  const handleTeamSelection = async (teamId) => {
    setImportConfig({ selectedTeamId: teamId });
    
    // Start import process
    await importLeagueData(detectedPlatform, {
      selectedTeamId: teamId,
      includeHistoricalData: importConfig.includeHistoricalData,
      syncPlayers: importConfig.syncPlayers,
      autoSync: importConfig.autoSync
    });
  };
  
  const handleStartOver = () => {
    resetImport();
    setCurrentStep(1);
    setUrlInput('');
  };
  
  const handleFinish = () => {
    router.push('/dashboard');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Import Fantasy League</h1>
        
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  h-1 w-24 mx-2
                  ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold">{steps[currentStep - 1]?.title}</h2>
          <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
        </div>
      </div>
      
      {/* Error Display */}
      {(error.detection || error.import) && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.detection || error.import}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Platform Detection */}
          {currentStep === 1 && (
            <PlatformDetection
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              onSubmit={handleUrlSubmit}
              loading={loading.detection}
              detectedPlatform={detectedPlatform}
            />
          )}
          
          {/* Step 2: League Preview */}
          {currentStep === 2 && detectedPlatform && (
            <LeaguePreview
              platform={detectedPlatform}
              onConfirm={handleLeagueConfirm}
              onBack={() => setCurrentStep(1)}
            />
          )}
          
          {/* Step 3: Team Selection */}
          {currentStep === 3 && (
            <TeamSelection
              onTeamSelect={handleTeamSelection}
              onBack={() => setCurrentStep(2)}
              loading={loading.import}
            />
          )}
          
          {/* Step 4: Import Progress */}
          {currentStep === 4 && (
            <ImportProgress />
          )}
          
          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Import Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your league has been successfully imported and is ready to use.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={handleFinish}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={handleStartOver}>
                  Import Another League
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

#### `components/import/PlatformDetection.js`
Platform detection component.

```javascript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Info } from 'lucide-react';

/**
 * Platform detection component for identifying fantasy platform from URL/ID
 */
export default function PlatformDetection({ 
  urlInput, 
  setUrlInput, 
  onSubmit, 
  loading, 
  detectedPlatform 
}) {
  const [showExamples, setShowExamples] = useState(false);
  
  const platforms = [
    {
      name: 'Fantrax',
      id: 'fantrax',
      examples: [
        'https://www.fantrax.com/fantasy/league/abc123def456',
        'abc123def456'
      ],
      description: 'Support for NBA, NFL, and MLB leagues'
    },
    {
      name: 'Sleeper',
      id: 'sleeper',
      examples: [
        'https://sleeper.app/leagues/123456789012345',
        '123456789012345'
      ],
      description: 'Support for NFL and NBA leagues'
    },
    {
      name: 'ESPN',
      id: 'espn',
      examples: [
        'https://fantasy.espn.com/basketball/league?leagueId=12345',
        'Coming soon...'
      ],
      description: 'Coming soon'
    },
    {
      name: 'Yahoo',
      id: 'yahoo',
      examples: [
        'https://basketball.fantasysports.yahoo.com/league/12345',
        'Coming soon...'
      ],
      description: 'Coming soon'
    }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleExampleClick = (example) => {
    setUrlInput(example);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Enter Your League Information</h3>
        <p className="text-gray-600">
          Paste your league URL or enter the league ID directly
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="league-url">League URL or ID</Label>
          <Input
            id="league-url"
            type="text"
            placeholder="https://www.fantrax.com/fantasy/league/abc123... or abc123def456"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!urlInput.trim() || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Detecting Platform...
            </>
          ) : (
            'Detect Platform'
          )}
        </Button>
      </form>
      
      {/* Detection Result */}
      {detectedPlatform && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Platform Detected
              </Badge>
              <span className="font-medium capitalize">{detectedPlatform}</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Supported Platforms */}
      <div>
        <Button
          variant="ghost"
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-gray-600 p-0 h-auto"
        >
          <Info className="w-4 h-4 mr-1" />
          {showExamples ? 'Hide' : 'Show'} supported platforms and examples
        </Button>
        
        {showExamples && (
          <div className="mt-4 space-y-4">
            {platforms.map((platform) => (
              <Card key={platform.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{platform.name}</h4>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                  {platform.id === 'espn' || platform.id === 'yahoo' ? (
                    <Badge variant="outline">Coming Soon</Badge>
                  ) : (
                    <Badge variant="outline">Supported</Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Examples:</p>
                  {platform.examples.map((example, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                        {example}
                      </code>
                      {example !== 'Coming soon...' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleExampleClick(example)}
                          className="text-xs"
                        >
                          Use This
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🚀 Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)
1. **Platform Adapter System**
   - Implement `BasePlatformAdapter` class
   - Create `FantraxAdapter` (building on existing code)
   - Set up adapter registry and factory pattern

2. **Enhanced Zustand Stores**
   - Build `useLeagueImport` store
   - Create `useImportedLeagues` store
   - Implement persistence and error handling

3. **Database Schema Enhancement**
   - Update `leagues` collection schema
   - Add indexes for performance
   - Create migration script for existing data

### Phase 2: UI Components (Week 2-3)
1. **Import Wizard**
   - Create multi-step `ImportLeagueWizard` component
   - Build `PlatformDetection` component
   - Implement `LeaguePreview` and `TeamSelection`

2. **League Management Interface**
   - Create `LeagueCard` components
   - Build sync status and controls
   - Integrate with existing dashboard

### Phase 3: Platform Expansion (Week 3-4)
1. **Additional Platform Adapters**
   - Implement `SleeperAdapter`
   - Create ESPN and Yahoo adapters (basic structure)
   - Add platform-specific validation

2. **Sport-Specific Processors**
   - Enhance `NBALeagueProcessor`
   - Create `NFLLeagueProcessor` and `MLBLeagueProcessor`
   - Implement sport-specific validation

### Phase 4: Advanced Features (Week 4-5)
1. **Synchronization System**
   - Implement auto-sync scheduling
   - Create sync conflict resolution
   - Add sync history and statistics

2. **Integration & Testing**
   - Integrate with existing `useMasterDataset`
   - Test with real league data
   - Performance optimization

### Phase 5: Polish & Documentation (Week 5-6)
1. **Error Handling & UX**
   - Comprehensive error messages
   - Loading states and progress indicators
   - User guidance and help

2. **Documentation & Migration**
   - Update API documentation
   - Create migration guide for existing leagues
   - User documentation and tutorials

---

## 🎯 Key Benefits

1. **Future-Proof Architecture**: Easy to add new platforms and sports
2. **Complete Data Storage**: Store everything, process as needed  
3. **Consistent User Experience**: Unified interface across all platforms
4. **Robust Synchronization**: Built-in sync capabilities for live updates
5. **Error Resilient**: Comprehensive error handling and recovery
6. **Performance Optimized**: Follows existing codebase patterns
7. **Modular Design**: Each component can be developed and tested independently

This architecture provides a solid foundation for supporting multiple fantasy platforms while maintaining the modular, sport-agnostic design principles evident throughout your codebase.