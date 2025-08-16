# Technology Stack & Build System

## Core Technologies
- **Framework**: Next.js 15 with App Router and Pages API
- **Runtime**: React 18, TypeScript/JavaScript
- **Database**: MongoDB (direct driver, no Mongoose)
- **Authentication**: Auth0
- **State Management**: Zustand (3 main stores)
- **Styling**: Tailwind CSS with custom design system

## UI Component Libraries
- **Primary**: AlignUI (custom design system in `components/alignui/`)
- **Base**: ShadCN UI components (`components/ui/`)
- **Icons**: Radix UI Icons, Lucide React, FontAwesome, RemixIcon
- **Charts**: Recharts, ApexCharts, Chart.js

## External APIs & Services
- **Sports Data**: MySportsFeeds API
- **Rankings**: FantasyCalc API
- **League Import**: Fantrax API (with plans for Sleeper, Yahoo, ESPN)
- **Analytics**: Google Analytics

## Development Commands

### Local Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
- MongoDB connection handled via `lib/mongodb.js`
- Collections: `players`, `leagues`, `stats`, `rankings`, `users`
- No migrations - direct MongoDB operations

### Environment Variables Required
```bash
MONGODB_URI=                    # MongoDB connection string
AUTH0_SECRET=                   # Auth0 configuration
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
MYSPORTSFEEDS_API_KEY=         # Sports data API
FANTASYCALC_API_KEY=           # Rankings API
GA_MEASUREMENT_ID=             # Google Analytics
```

## Build Configuration
- **Next.js Config**: Custom webpack config for `.node` files
- **Tailwind**: Extensive custom configuration with design tokens
- **TypeScript**: Configured with path aliases (`@/*`)
- **PostCSS**: Standard configuration for Tailwind processing

## Deployment
- **Platform**: Vercel (optimized for Next.js)
- **Database**: MongoDB Atlas (cloud-hosted)
- **CDN**: Vercel Edge Network for static assets