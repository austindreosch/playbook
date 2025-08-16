# Authentication Infrastructure

This directory contains the enhanced authentication infrastructure for multi-platform league import, implementing secure credential management, OAuth flows, and platform-specific authentication methods.

## Components

### 1. CredentialManager (`CredentialManager.js`)
Handles secure storage and retrieval of platform credentials using AES-256-GCM encryption.

**Features:**
- AES-256-GCM encryption for sensitive data
- Secure credential storage in MongoDB
- Automatic expiration handling
- Credential validation and refresh
- Audit trail for credential operations

**Usage:**
```javascript
import CredentialManager from './CredentialManager.js';

const credManager = new CredentialManager();

// Store credentials
await credManager.storeCredentials(userId, 'yahoo', {
  accessToken: 'token',
  refreshToken: 'refresh'
}, 3600); // expires in 1 hour

// Retrieve credentials
const credentials = await credManager.getCredentials(userId, 'yahoo');
```

### 2. OAuthManager (`OAuthManager.js`)
Manages OAuth flows for platforms that require OAuth authentication (currently Yahoo Fantasy Sports).

**Features:**
- Secure OAuth state generation with CSRF protection
- Token exchange and refresh handling
- State validation and cleanup
- Support for multiple OAuth platforms

**Usage:**
```javascript
import OAuthManager from './OAuthManager.js';

const oauthManager = new OAuthManager();

// Initiate OAuth flow
const { authUrl, state } = await oauthManager.initiateOAuth('yahoo', redirectUri, userId);

// Handle callback
const tokens = await oauthManager.handleCallback('yahoo', code, state, redirectUri);
```

### 3. AuthenticationHelper (`AuthenticationHelper.js`)
Unified interface for all authentication operations across platforms.

**Features:**
- Platform-agnostic authentication interface
- Credential validation for all platforms
- Automatic credential refresh
- Platform capability detection

**Usage:**
```javascript
import AuthenticationHelper from './AuthenticationHelper.js';

const authHelper = new AuthenticationHelper();

// Validate credentials
const validation = await authHelper.validateCredentials('sleeper', { userId: 'user123' });

// Store validated credentials
if (validation.valid) {
  await authHelper.storeCredentials(userId, 'sleeper', credentials);
}
```

### 4. Enhanced Platform Integrations
Updated platform integration classes with credential validation methods.

**New Methods:**
- `validateCredentials(credentials)` - Validate platform-specific credentials
- `refreshAuthentication(credentials)` - Refresh expired credentials
- `storeUserCredentials(userId, credentials)` - Store credentials securely
- `getUserCredentials(userId)` - Retrieve stored credentials

## Platform Authentication Types

| Platform | Auth Type | Required Fields | OAuth Support |
|----------|-----------|----------------|---------------|
| Fantrax  | userSecret | userSecretId | No |
| Sleeper  | userId | userId, season (optional) | No |
| Yahoo    | oauth | - | Yes |
| ESPN     | cookies | cookies, testLeagueId | No |

## API Endpoints

### `/api/auth/platform-credentials`
Manages platform credentials for authenticated users.

**Methods:**
- `GET` - Retrieve credential status or requirements
- `POST` - Validate and store new credentials
- `PUT` - Refresh existing credentials
- `DELETE` - Revoke credentials

### `/api/auth/oauth-initiate`
Initiates OAuth flows for supported platforms.

**Method:** `POST`
**Body:** `{ platform: 'yahoo' }`
**Response:** `{ authUrl, state, platform }`

### `/api/auth/oauth-callback`
Handles OAuth callbacks and token exchange.

**Method:** `GET`
**Query Params:** `platform`, `code`, `state`

## Environment Variables

Required environment variables for full functionality:

```bash
# Encryption
CREDENTIAL_ENCRYPTION_KEY=<base64-encoded-32-byte-key>
OAUTH_STATE_SECRET=<secure-random-string>

# Yahoo OAuth (when implementing Yahoo integration)
YAHOO_CLIENT_ID=<yahoo-client-id>
YAHOO_CLIENT_SECRET=<yahoo-client-secret>

# Database
MONGODB_URI=<mongodb-connection-string>

# Auth0 (for user authentication)
AUTH0_BASE_URL=<base-url-for-oauth-callbacks>
```

## Security Features

1. **Encryption**: All sensitive credentials encrypted with AES-256-GCM
2. **CSRF Protection**: OAuth state parameters include HMAC signatures
3. **Expiration**: Automatic cleanup of expired credentials and OAuth states
4. **Validation**: All credentials validated before storage
5. **Audit Trail**: Comprehensive logging of credential operations

## Database Schema

### `platformCredentials` Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  platform: String,
  encryptedData: String,
  iv: String,
  tag: String,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date,
  lastUsed: Date,
  isActive: Boolean
}
```

### `oauthStates` Collection
```javascript
{
  _id: ObjectId,
  state: String,
  userId: String,
  platform: String,
  redirectUri: String,
  createdAt: Date,
  expiresAt: Date
}
```

## Testing

Run the authentication infrastructure tests:

```bash
node lib/auth/__tests__/simple-auth-test.js
```

This verifies:
- Encryption/decryption functionality
- OAuth state generation
- Platform authentication types
- Credential requirements structure

## Next Steps

1. Set up Yahoo OAuth credentials in environment
2. Implement UI components for authentication flows
3. Add rate limiting for API endpoints
4. Implement credential refresh background jobs
5. Add monitoring and analytics for authentication events