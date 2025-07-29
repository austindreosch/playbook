#!/usr/bin/env node

/**
 * MongoDB Connection Migration Script
 * 
 * This script automatically converts API endpoints from individual MongoDB connections
 * to use the shared connection utility (lib/mongodb.js) for better connection efficiency.
 * 
 * Usage: node scripts/migrate-mongodb-connections.js
 */

const fs = require('fs');
const path = require('path');

// List of files that need migration (excluding already converted ones)
const filesToMigrate = [
    'pages/api/fetch/user.js',
    'pages/api/importleague.js',
    'pages/api/admin/link-player.js',
    'pages/api/admin/deleteRankingPlayer.js',
    'pages/api/admin/add-name-variant.js',
    'pages/api/admin/create-prospect-player.js',
    'pages/api/load/MasterDatasetFetch.js',
    'pages/api/rankings/cleanup.js',
    'pages/api/rankings/history.js',
    'pages/api/rankings/create.js',
    'pages/api/load/leagues.js',
    'pages/api/pull/nbaRawData.js',
    'pages/api/pull/mlbRawData.js',
    'pages/api/pull/nflRawData.js'
];

/**
 * Convert MongoDB import and connection patterns
 */
function migrateFileContent(content, filePath) {
    let migrated = content;
    
    // Calculate the relative path to lib/mongodb.js based on file location
    const fileDir = path.dirname(filePath);
    const libPath = path.relative(fileDir, 'lib/mongodb.js').replace(/\\/g, '/');
    
    // If the path doesn't start with ./ or ../, add ./
    const importPath = libPath.startsWith('.') ? libPath : `./${libPath}`;
    
    console.log(`Migrating ${filePath} with import path: ${importPath}`);
    
    // Step 1: Replace MongoDB imports
    migrated = migrated.replace(
        /import\s*{\s*MongoClient(?:\s*,\s*[^}]*)?}\s*from\s*['"]mongodb['"];?/g,
        ''
    );
    
    migrated = migrated.replace(
        /const\s*{\s*MongoClient(?:\s*,\s*[^}]*)?}\s*=\s*require\(['"]mongodb['"]\);?/g,
        ''
    );
    
    // Step 2: Add our shared connection import at the top
    if (!migrated.includes('getDatabase')) {
        // Find the first import statement or top of file
        const firstImportMatch = migrated.match(/^(import|const)/m);
        if (firstImportMatch) {
            const insertIndex = migrated.indexOf(firstImportMatch[0]);
            migrated = migrated.slice(0, insertIndex) + 
                      `import { getDatabase } from '${importPath}';\n` + 
                      migrated.slice(insertIndex);
        } else {
            migrated = `import { getDatabase } from '${importPath}';\n\n` + migrated;
        }
    }
    
    // Step 3: Remove mongoUri/uri constants
    migrated = migrated.replace(
        /const\s+(?:mongoUri|uri)\s*=\s*process\.env\.MONGODB_URI;?\n?/g,
        ''
    );
    
    // Step 4: Remove client connection patterns
    migrated = migrated.replace(
        /const\s+client\s*=\s*new\s+MongoClient\([^;]+\);?\n?/g,
        ''
    );
    
    migrated = migrated.replace(
        /let\s+client[^;]*;?\n?/g,
        ''
    );
    
    // Step 5: Replace client.connect() patterns
    migrated = migrated.replace(
        /await\s+client\.connect\(\);?\n?/g,
        ''
    );
    
    // Step 6: Replace database access patterns
    migrated = migrated.replace(
        /const\s+db\s*=\s*client\.db\(['"][^'"]*['"]\);?/g,
        'const db = await getDatabase();'
    );
    
    migrated = migrated.replace(
        /client\.db\(['"][^'"]*['"]\)/g,
        'await getDatabase()'
    );
    
    // Step 7: Remove client.close() patterns in finally blocks
    migrated = migrated.replace(
        /}\s*finally\s*{\s*(?:if\s*\([^)]*client[^)]*\)\s*{)?[^}]*client\.close\(\)[^}]*}?\s*}/g,
        '}'
    );
    
    migrated = migrated.replace(
        /await\s+client\.close\(\);?\n?/g,
        ''
    );
    
    // Step 8: Clean up extra whitespace
    migrated = migrated.replace(/\n\n\n+/g, '\n\n');
    
    return migrated;
}

/**
 * Backup a file before migration
 */
function backupFile(filePath) {
    const backupPath = `${filePath}.backup`;
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(filePath, backupPath);
        console.log(`Created backup: ${backupPath}`);
    }
}

/**
 * Migrate a single file
 */
function migrateFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}`);
            return false;
        }
        
        console.log(`\n🔄 Migrating: ${filePath}`);
        
        // Create backup
        backupFile(filePath);
        
        // Read and migrate content
        const originalContent = fs.readFileSync(filePath, 'utf8');
        const migratedContent = migrateFileContent(originalContent, filePath);
        
        // Only write if content changed
        if (originalContent !== migratedContent) {
            fs.writeFileSync(filePath, migratedContent);
            console.log(`✅ Successfully migrated: ${filePath}`);
            return true;
        } else {
            console.log(`➖ No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error migrating ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Main migration function
 */
function main() {
    console.log('🚀 Starting MongoDB Connection Migration\n');
    console.log('This script will convert individual MongoDB connections to use shared connections.\n');
    
    let migrated = 0;
    let failed = 0;
    
    for (const filePath of filesToMigrate) {
        const success = migrateFile(filePath);
        if (success) {
            migrated++;
        } else {
            failed++;
        }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${migrated} files`);
    console.log(`❌ Failed or no changes: ${failed} files`);
    console.log(`📁 Total processed: ${filesToMigrate.length} files`);
    
    if (migrated > 0) {
        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Test your APIs to ensure they work correctly');
        console.log('2. Remove .backup files once you confirm everything works');
        console.log('3. Monitor MongoDB connection usage');
    }
}

// Run the migration
if (require.main === module) {
    main();
}

module.exports = { migrateFileContent, migrateFile };