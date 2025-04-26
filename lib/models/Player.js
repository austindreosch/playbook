/**
 * Represents a player document in the 'players' collection.
 *
 * @typedef {Object} Player
 * @property {import('mongodb').ObjectId | string} playbookID - Your app's main identifier (MongoDB ObjectId).
 * @property {string} primaryFirstName - The player's primary first name.
 * @property {string} primaryLastName - The player's primary last name.
 * @property {string} primaryName - How this player will show on your website (e.g., concatenation of first + last).
 * @property {string[]} nameVariants - All alternative spellings or names used on different platforms.
 * @property {PlatformIdentifier} [mySportsFeeds] - MySportsFeeds platform details.
 * @property {PlatformIdentifier} [espn] - ESPN platform details.
 * @property {PlatformIdentifier} [yahoo] - Yahoo platform details.
 * @property {PlatformIdentifier} [sleeper] - Sleeper platform details.
 * @property {PlatformIdentifier} [fantrax] - Fantrax platform details.
 * // TODO: Add placeholders for other potential platforms as needed
 * @property {Date} lastUpdated - Timestamp of the last update to this document.
 * @property {Date} createdAt - Timestamp of when the document was created (often managed by MongoDB or application logic).
 * // TODO: Add sport field (e.g., 'nfl', 'nba', 'mlb') - Should likely be a required field.
 * // TODO: Consider adding team information if available from MSF
 * // TODO: Consider adding position information
 */

/**
 * Represents platform-specific identifiers and names for a player.
 *
 * @typedef {Object} PlatformIdentifier
 * @property {string | null} [id] - The ID used by the specific platform.
 * @property {string | null} [name] - The name used by the specific platform.
 * @property {Date | null} [lastVerified] - Timestamp of the last time this platform information was verified.
 */

// Note: This file primarily serves as documentation for the expected
// structure of documents in the 'players' collection.
// Actual database interaction logic (fetching, saving) will occur elsewhere. 

/*
const examplePlayer = {
  playbookID: new ObjectId(), // Assuming you have ObjectId imported from your MongoDB driver
  primaryFirstName: "Patrick",
  primaryLastName: "Mahomes",
  primaryName: "Patrick Mahomes",
  nameVariants: ["Pat Mahomes", "P. Mahomes II"],
  sport: "NFL",
  team: "KC",
  position: "QB"

  mySportsFeeds: {
    id: "12345",
    name: "Patrick Mahomes",
    lastVerified: new Date()
  },
  espn: {
    id: "54321",
    name: "Patrick Mahomes II",
    lastVerified: new Date()
  },
//   ... other platforms
  lastUpdated: new Date(),
  createdAt: new Date(),
};
*/