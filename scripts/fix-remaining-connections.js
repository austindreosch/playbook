#!/usr/bin/env node

/**
 * Fix Remaining MongoDB Connections
 * 
 * This script specifically fixes the files that weren't properly converted
 * by the initial migration script.
 */

const fs = require('fs');

// Files that need specific fixes
const filesToFix = [
    'pages/api/importleague.js',
    'pages/api/load/MasterDatasetFetch.js', 
    'pages/api/load/leagues.js',
    'pages/api/pull/mlbRawData.js',
    'pages/api/pull/nbaRawData.js',
    'pages/api/pull/nflRawData.js',
    'pages/api/rankings/cleanup.js',
    'pages/api/rankings/create.js',
    'pages/api/rankings/history.js'
];

function fixFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}`);
            return false;
        }

        console.log(`🔧 Fixing: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Remove MongoDB imports
        content = content.replace(/import\s*{\s*MongoClient[^}]*}\s*from\s*['"]mongodb['"];\s*\n?/g, '');
        content = content.replace(/const\s*{\s*MongoClient[^}]*}\s*=\s*require\(['"]mongodb['"]\);\s*\n?/g, '');
        
        // Add shared connection import if not present
        if (!content.includes('getDatabase') && !content.includes('connectToDatabase')) {
            // Calculate relative path
            const depth = filePath.split('/').length - 1;
            const relativePath = '../'.repeat(depth - 1) + 'lib/mongodb';
            
            // Add import at the top
            const firstImportMatch = content.match(/^(import|const)/m);
            if (firstImportMatch) {
                const insertIndex = content.indexOf(firstImportMatch[0]);
                content = content.slice(0, insertIndex) + 
                         `import { getDatabase } from '${relativePath}';\n` + 
                         content.slice(insertIndex);
            } else {
                content = `import { getDatabase } from '${relativePath}';\n\n` + content;
            }
        }
        
        // Replace connection patterns
        content = content.replace(/const\s+client\s*=\s*new\s+MongoClient[^;]+;\s*\n?/g, '');
        content = content.replace(/await\s+client\.connect\(\);\s*\n?/g, '');
        content = content.replace(/const\s+db\s*=\s*client\.db\(['"][^'"]*['"]\);\s*/g, 'const db = await getDatabase();');
        content = content.replace(/client\.db\(['"][^'"]*['"]\)/g, 'await getDatabase()');
        
        // Remove client.close() and finally blocks
        content = content.replace(/}\s*finally\s*{\s*[^}]*client\.close\(\)[^}]*}\s*/g, '}');
        content = content.replace(/await\s+client\.close\(\);\s*\n?/g, '');
        
        // Remove mongo URI constants
        content = content.replace(/const\s+(?:mongoUri|uri)\s*=\s*process\.env\.MONGODB_URI;\s*\n?/g, '');
        
        // Clean up extra whitespace
        content = content.replace(/\n\n\n+/g, '\n\n');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`➖ No changes needed: ${filePath}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🔧 Fixing remaining MongoDB connection issues...\n');
    
    let fixed = 0;
    
    for (const file of filesToFix) {
        if (fixFile(file)) {
            fixed++;
        }
    }
    
    console.log(`\n📊 Summary: Fixed ${fixed} out of ${filesToFix.length} files`);
    
    if (fixed > 0) {
        console.log('\n🎉 Fixes applied! Run the test again to verify.');
    }
}

if (require.main === module) {
    main();
}