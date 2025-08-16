# Project Structure & Organization

## Root Directory Structure
```
playbook/
├── app/                    # Next.js App Router pages
├── pages/api/             # API routes (Pages Router)
├── components/            # React components
├── lib/                   # Utility libraries and configurations
├── stores/                # Zustand state management
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── utilities/             # Legacy utilities (being migrated)
├── contexts/              # React contexts
├── public/                # Static assets
└── docs/                  # Documentation files
```

## Component Architecture

### Primary Component Categories
- **`components/alignui/`** - Custom design system components (primary UI library)
- **`components/ui/`** - ShadCN base components
- **`components/dashboard/`** - Dashboard-specific components
- **`components/RankingsPage/`** - Rankings interface components
- **`components/PlayerList/`** - Sport-specific player components
- **`components/common/`** - Shared utility components
- **`components/LandingPage/`** - Marketing/landing page components

### Sport-Specific Organization
Components are organized by sport when needed:
```
components/PlayerList/
├── NBA/                   # Basketball-specific components
├── NFL/                   # Football-specific components
└── MLB/                   # Baseball-specific components
```

## API Structure
```
pages/api/
├── load/                  # Data fetching endpoints
├── players/               # Player data management
├── rankings/              # Rankings CRUD operations
├── admin/                 # Administrative functions
├── auth/                  # Authentication endpoints
├── dashboard/             # Dashboard data endpoints
├── platforms/             # League platform integrations
└── user-rankings/         # User ranking management
```

## State Management Architecture

### Store Organization
```
stores/
├── useMasterDataset.js    # Central sports data store
├── useUserRankings.js     # User-created rankings
└── dashboard/
    ├── useDashboardContext.js    # Dashboard state
    ├── useTradeContext.js        # Trade calculator state
    └── config.js                 # Dashboard configuration
```

### Store Responsibilities
- **MasterDataset**: All player stats, identities, and processed data across sports
- **Dashboard**: League-specific state, UI preferences, widget layouts
- **UserRankings**: CRUD operations for user-created ranking lists

## Data Processing Pipeline
```
lib/
├── utils/
│   ├── nbaDataProcessing.js    # NBA-specific data processing
│   ├── nflDataProcessing.js    # NFL-specific data processing
│   ├── mlbDataProcessing.js    # MLB-specific data processing
│   └── sportConfig.js          # Sport configuration constants
├── calculations/
│   ├── zScoreUtil.js           # Statistical analysis utilities
│   └── derivedStatCalculations.js
└── tasks/                      # Background data sync tasks
```

## Styling Architecture

### Tailwind Configuration
- **Custom Design Tokens**: Extensive color system, typography scale, spacing
- **Component Variants**: Comprehensive variant system using `tailwind-variants`
- **Sport-Specific Colors**: Custom color palette for team/sport theming

### CSS Organization
- **`app/globals.css`** - Global styles and CSS variables
- **Component-level**: Tailwind classes with design system tokens
- **AlignUI System**: Consistent component styling patterns

## File Naming Conventions

### Components
- **PascalCase** for component files: `PlayerCard.jsx`, `DashboardTabs.tsx`
- **camelCase** for utility files: `sportConfig.js`, `calculateScore.js`
- **kebab-case** for page routes: `verify-email/page.js`

### API Routes
- **camelCase** for API files: `importleague.js`, `MasterDatasetFetch.js`
- **RESTful patterns** where applicable: `GET /api/players/list`, `POST /api/rankings`

## Import Patterns

### Path Aliases
```javascript
// Use @ alias for root imports
import { Button } from '@/components/alignui/button'
import { connectToDatabase } from '@/lib/mongodb'
import useMasterDataset from '@/stores/useMasterDataset'
```

### Component Imports
```javascript
// AlignUI components (preferred)
import { Button, Input, Badge } from '@/components/alignui'

// ShadCN components (fallback)
import { Card, CardContent } from '@/components/ui/card'

// Sport-specific components
import DetailPanelNBA from '@/components/PlayerList/NBA/DetailPanelNBA'
```

## Configuration Files
- **`next.config.js`** - Next.js configuration with webpack customizations
- **`tailwind.config.ts`** - Extensive Tailwind customization with design tokens
- **`jsconfig.json`** - Path aliases and JSX configuration
- **`package.json`** - Dependencies and build scripts

## Asset Organization
```
public/
├── icons/                 # SVG icons and brand assets
├── images/                # Static images
├── docs/                  # Public documentation files
└── videos/                # Video assets
```

## Development Patterns

### Sport-Agnostic Design
- Components designed to work across NBA/NFL/MLB
- Configuration-driven sport-specific behavior
- Shared data processing patterns with sport-specific processors

### State Management Patterns
- Zustand stores for global state
- React Context for component-tree state
- localStorage integration for user preferences

### Error Handling
- Comprehensive error states in stores
- API error handling with user-friendly messages
- Loading states for all async operations