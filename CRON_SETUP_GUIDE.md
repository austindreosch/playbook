# Sports Datafeed Cron Jobs Setup Guide for Vercel

This guide provides step-by-step instructions for setting up automated daily sports data updates using Vercel's cron job functionality.

## 📋 Overview

The system includes:
- **Master cron job** (6:00 AM UTC) - Orchestrates all sports updates
- **Individual sport cron jobs** (NBA: 7 AM, NFL: 8 AM, MLB: 9 AM UTC)
- **Monitoring and management tools**
- **Manual trigger capabilities**

## 🚀 Implementation Steps

### Step 1: Environment Variables Configuration

Add these environment variables to your Vercel project:

#### Required Variables
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# MySportsFeeds API
MYSPORTSFEEDS_API_KEY=your_api_key
MYSPORTSFEEDS_API_VERSION=v2.1
MYSPORTSFEEDS_NBA_SEASON=2024-2025-regular
MYSPORTSFEEDS_NFL_SEASON=2024-2025-regular
MYSPORTSFEEDS_MLB_SEASON=2025-regular
MYSPORTSFEEDS_MLB_PROJECTION_SEASON=2025-regular

# Application
NEXTAUTH_URL=https://your-app.vercel.app

# Security (Generate random secrets)
CRON_SECRET=your_secure_random_string_32_chars
INTERNAL_API_SECRET=your_secure_random_string_32_chars
ADMIN_SECRET=your_secure_random_string_32_chars
```

#### How to Add in Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add each variable with appropriate values

### Step 2: Deploy the Code

1. Commit all the new files to your repository
2. Push to your main branch
3. Vercel will automatically deploy with the new cron configuration

### Step 3: Verify Cron Jobs are Active

After deployment, check the Vercel dashboard:
1. Go to your project dashboard
2. Navigate to Functions tab
3. Look for cron jobs section - you should see 4 scheduled functions

## 📅 Cron Schedule Details

| Job | Schedule | Time (UTC) | Purpose |
|-----|----------|------------|---------|
| Master | `0 6 * * *` | 6:00 AM | Orchestrates all updates |
| NBA | `0 7 * * *` | 7:00 AM | Individual NBA update |
| NFL | `0 8 * * *` | 8:00 AM | Individual NFL update |
| MLB | `0 9 * * *` | 9:00 AM | Individual MLB update |

### Why These Times?
- **Early morning UTC** ensures data is fresh for US users
- **Sequential execution** prevents API rate limit issues
- **1-hour spacing** allows for troubleshooting individual sports

## 🔧 API Endpoints

### Cron Job Endpoints
- `POST /api/cron/daily-sports-update` - Master orchestrator
- `POST /api/cron/nba-update` - NBA only
- `POST /api/cron/nfl-update` - NFL only  
- `POST /api/cron/mlb-update` - MLB only

### Management Endpoints
- `GET /api/cron/status` - System health and status
- `POST /api/cron/trigger` - Manual job execution

## 📊 Monitoring and Management

### Check System Status
```bash
curl https://your-app.vercel.app/api/cron/status
```

Response includes:
- Last update times for each sport
- Data staleness indicators
- Database and API connectivity status
- Next scheduled run times

### Manual Trigger (for testing)
```bash
curl -X POST https://your-app.vercel.app/api/cron/trigger \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"job": "nba"}'
```

Available jobs: `nba`, `nfl`, `mlb`, `master`

## 🚨 Troubleshooting

### Common Issues

#### 1. Cron Jobs Not Running
- **Check:** Environment variables are properly set
- **Check:** Vercel deployment succeeded without errors
- **Check:** `vercel.json` is in root directory and properly formatted

#### 2. Authentication Errors
- **Solution:** Verify `CRON_SECRET` environment variable matches
- **Check:** Vercel automatically adds auth headers for cron requests

#### 3. API Rate Limits
- **Built-in protection:** 2-second delays between sports updates
- **MySportsFeeds limits:** 5,000 requests/day (should be sufficient)

#### 4. Database Connection Issues
- **Check:** `MONGODB_URI` is correct and accessible from Vercel
- **Check:** MongoDB Atlas network access allows Vercel IPs

### Log Monitoring

#### Vercel Dashboard
1. Go to your project → Functions
2. Click on any cron function
3. View execution logs and errors

#### Console Logs
The cron jobs include detailed console logging:
- 🚀 Start markers
- ✅ Success indicators  
- ❌ Error markers
- ⏱️ Timing information

## 🔄 Seasonal Updates

### Update Seasons (Important!)
When sports seasons change, update these environment variables:
- `MYSPORTSFEEDS_NBA_SEASON`
- `MYSPORTSFEEDS_NFL_SEASON`  
- `MYSPORTSFEEDS_MLB_SEASON`
- `MYSPORTSFEEDS_MLB_PROJECTION_SEASON`

Example format: `2025-2026-regular`

## 📈 Performance Expectations

### Execution Times
- **NBA Update:** ~2-4 minutes
- **NFL Update:** ~2-4 minutes
- **MLB Update:** ~4-6 minutes (more endpoints)
- **Master Update:** ~8-14 minutes total

### Data Volume
- **NBA:** ~500-1000 records per update
- **NFL:** ~2000-3000 records per update
- **MLB:** ~3000-5000 records per update

## 🛡️ Security Considerations

### Environment Variables
- Use strong, random secrets (32+ characters)
- Never commit secrets to code repository
- Rotate secrets periodically

### API Access
- Cron endpoints require `CRON_SECRET` authorization
- Manual trigger requires `ADMIN_SECRET`
- Internal API calls use `INTERNAL_API_SECRET`

## 🔧 Customization Options

### Modify Schedules
Edit `vercel.json` cron schedules:
```json
{
  "path": "/api/cron/daily-sports-update",
  "schedule": "0 6 * * *"  // Change this time
}
```

### Add New Sports
1. Create new data pull endpoint: `/api/pull/newSportRawData.js`
2. Add cron job in `vercel.json`
3. Create individual cron endpoint: `/api/cron/newsport-update.js`
4. Update master cron job to include new sport

### Disable Individual Sports
Comment out specific cron jobs in `vercel.json` or remove from master cron job array.

## 📞 Support

### Status Dashboard
Use `/api/cron/status` to get comprehensive system status

### Manual Recovery
If daily updates fail:
1. Check logs in Vercel dashboard
2. Use manual trigger to retry specific sports
3. Check MySportsFeeds API status
4. Verify database connectivity

### Contact Points
- **Vercel Issues:** Check Vercel status page
- **MySportsFeeds API:** Check their status/support
- **MongoDB:** Check Atlas status page

---

**Last Updated:** $(date +%Y-%m-%d)
**Version:** 1.0.0