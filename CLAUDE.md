# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Playbook is a fantasy sports toolkit built with Next.js 15, MongoDB, Auth0, and Tailwind CSS. It supports NBA, NFL, and MLB fantasy leagues with AI-powered insights, player rankings, trade analysis, and league management features.

## Tech Stack & Tools
- **Framework**: Next.js 15 (App Router for pages, `/pages/api/` for API routes)
- **Database**: MongoDB (no Mongoose, direct MongoDB driver)
- **Authentication**: Auth0
- **Styling**: Tailwind CSS with custom theme, ShadCN components, DaisyUI
- **State Management**: Zustand
- **Icons**: Lucide React, FontAwesome
- **Deployment**: Vercel
- **Search**: Fuse.js for fuzzy matching

## Development Commands
```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture Overview

### Data Flow
1. **Raw Data Ingestion**: External APIs (MySportsFeeds, FantasyCalc) → MongoDB collections
2. **Data Processing**: Sport-specific processors with Z-score calculations → Zustand store
3. **UI Components**: Consume processed data from store → Render dashboards/rankings

### Key Directories
- `app/` - Next.js App Router pages
- `pages/api/` - API routes (still using Pages Router for APIs)
- `components/` - Reusable UI components organized by feature
- `stores/` - Zustand state management
- `lib/` - Utilities, MongoDB connection, calculations
- `utilities/` - Helper functions and data processing
- `hooks/` - Custom React hooks

### State Management (Zustand)
- **Master Dataset Store** (`stores/useMasterDataset.js`): Central store for all player data across sports
- **Dashboard Context** (`stores/dashboard/useDashboardContext.js`): League and team-specific state
- **User Rankings** (`stores/useUserRankings.js`): User-created ranking lists

### Database Schema
- **Collections**: `players`, `rankings`, `leagues`, `users`
- **Sport-Agnostic Design**: Common fields across sports with sport-specific extensions
- **No Mongoose**: Direct MongoDB driver usage

### Component Architecture
- **Feature-Based Organization**: `components/dashboard/`, `components/admin/`, etc.
- **ShadCN Base**: Custom components built on ShadCN foundations
- **Sport-Agnostic Components**: Designed to work across NBA/NFL/MLB

## Development Guidelines

### Sport-Agnostic Design
Design every feature as sport-agnostic modular structures. Be mindful of different sports (NBA, NFL, MLB), fantasy scoring formats, league variants, and future sports by abstracting rules, stats, and calculations. Insert clear TODO placeholders for sport-specific constants, mappings, and UI labels.

### Styling Rules
Never change component styling unless specifically requested. The UI design is manually crafted - focus on logic implementations only.

### Code Standards
- Use existing tooling (JavaScript, Next.js 15, MongoDB, Zustand, Auth0, Tailwind, Vercel, Lucide, ShadCN, Fuse.js)
- Follow established patterns in the codebase
- No Mongoose schemas - use direct MongoDB operations
- Sport-agnostic design patterns

### Key Files to Understand
- `lib/mongodb.js` - Database connection utilities
- `stores/useMasterDataset.js` - Main data store with sport-specific processors
- `components/dashboard/dashboardConfig.js` - Widget configuration
- `lib/calculations/` - Z-score and derived stat calculations
- `utilities/calculateScore.js` - Player scoring algorithms

### API Routes Structure
- `pages/api/load/` - Data fetching endpoints
- `pages/api/players/` - Player data management
- `pages/api/rankings/` - Rankings CRUD operations
- `pages/api/admin/` - Administrative functions

### Testing
No specific test framework is configured. Check the codebase for any existing test patterns before implementing tests.

## Data Processing Pipeline

### Player Data Flow
1. **Raw Data** → `pages/api/load/MasterDatasetFetch.js`
2. **Processing** → `lib/utils/{sport}DataProcessing.js`
3. **Z-Score Calculation** → `lib/calculations/zScoreUtil.js`
4. **Store Update** → `stores/useMasterDataset.js`

### Sport-Specific Processors
- **NBA**: `lib/utils/nbaDataProcessing.js`
- **NFL**: `lib/utils/nflDataProcessing.js` (includes team totals)
- **MLB**: `lib/utils/mlbDataProcessing.js` (includes projections)