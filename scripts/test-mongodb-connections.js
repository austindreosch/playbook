#!/usr/bin/env node

/**
 * MongoDB Connection Test Suite
 * 
 * This script automatically tests all API endpoints to ensure they're using
 * the shared MongoDB connection system instead of individual connections.
 * 
 * Usage: node scripts/test-mongodb-connections.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

/**
 * Test patterns that indicate proper shared connection usage
 */
const GOOD_PATTERNS = [
    /import.*getDatabase.*from.*mongodb/,
    /import.*connectToDatabase.*from.*mongodb/,
    /import.*getCollection.*from.*mongodb/,
    /const\s+db\s*=\s*await\s+getDatabase\(\)/,
    /await\s+getDatabase\(\)/,
    /await\s+connectToDatabase\(\)/,
];

/**
 * Anti-patterns that indicate individual connections (bad)
 */
const BAD_PATTERNS = [
    {
        pattern: /new\s+MongoClient\s*\(/,
        description: "Creating new MongoClient instances",
        severity: "HIGH"
    },
    {
        pattern: /import.*MongoClient.*from.*['"]mongodb['"]/,
        description: "Importing MongoClient directly from mongodb",
        severity: "HIGH"
    },
    {
        pattern: /const.*MongoClient.*require.*mongodb/,
        description: "Requiring MongoClient directly from mongodb",
        severity: "HIGH"
    },
    {
        pattern: /await\s+client\.connect\(\)/,
        description: "Manually connecting MongoDB client",
        severity: "HIGH"
    },
    {
        pattern: /client\.close\(\)/,
        description: "Manually closing MongoDB client",
        severity: "MEDIUM"
    },
    {
        pattern: /mongoUri\s*=\s*process\.env\.MONGODB_URI/,
        description: "Using direct MongoDB URI instead of shared connection",
        severity: "MEDIUM"
    },
    {
        pattern: /client\.db\(['"][^'"]*['"]\)/,
        description: "Accessing database directly from client",
        severity: "MEDIUM"
    }
];

/**
 * File patterns to exclude from testing
 */
const EXCLUDE_PATTERNS = [
    /\.backup$/,
    /node_modules/,
    /\.git/,
    /deprecated/,
    /test-mongodb-connections\.js$/,
    /migrate-mongodb-connections\.js$/,
    /lib\/mongodb\.js$/, // Our shared connection file
    /\.md$/,
    /\.json$/
];

/**
 * Test results storage
 */
const testResults = {
    totalFiles: 0,
    passedFiles: 0,
    failedFiles: 0,
    excludedFiles: 0,
    issues: [],
    goodFiles: [],
    badFiles: []
};

/**
 * Check if file should be excluded from testing
 */
function shouldExcludeFile(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Test a single file for MongoDB connection patterns
 */
function testFile(filePath) {
    try {
        if (shouldExcludeFile(filePath)) {
            testResults.excludedFiles++;
            return { status: 'excluded', reason: 'Excluded by pattern' };
        }

        if (!fs.existsSync(filePath)) {
            return { status: 'error', reason: 'File not found' };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        
        // Remove comments and strings to avoid false positives
        const contentWithoutComments = content
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
            .replace(/\/\/.*$/gm, '') // Remove // comments
            .replace(/'[^']*'/g, "''") // Remove single-quoted strings
            .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
            .replace(/`[^`]*`/g, '``'); // Remove template literals
        
        const issues = [];
        const goodPatterns = [];

        // Check for bad patterns (only in active code)
        BAD_PATTERNS.forEach(({ pattern, description, severity }) => {
            const matches = contentWithoutComments.match(pattern);
            if (matches) {
                issues.push({
                    pattern: pattern.toString(),
                    description,
                    severity,
                    match: matches[0],
                    file: filePath
                });
            }
        });

        // Check for good patterns
        GOOD_PATTERNS.forEach(pattern => {
            if (pattern.test(content)) {
                goodPatterns.push(pattern.toString());
            }
        });

        // Determine if file has MongoDB-related code
        const hasMongoCode = content.includes('mongo') || 
                           content.includes('MongoDB') || 
                           content.includes('database') ||
                           content.includes('collection');

        testResults.totalFiles++;

        if (issues.length === 0) {
            testResults.passedFiles++;
            if (hasMongoCode && goodPatterns.length > 0) {
                testResults.goodFiles.push({
                    file: filePath,
                    goodPatterns,
                    hasSharedConnection: true
                });
            }
            return { 
                status: 'pass', 
                hasMongoCode, 
                goodPatterns: goodPatterns.length,
                issues: 0 
            };
        } else {
            testResults.failedFiles++;
            testResults.badFiles.push({
                file: filePath,
                issues,
                hasMongoCode
            });
            testResults.issues.push(...issues);
            return { 
                status: 'fail', 
                issues: issues.length,
                hasMongoCode,
                issueDetails: issues 
            };
        }

    } catch (error) {
        return { status: 'error', reason: error.message };
    }
}

/**
 * Recursively find all JavaScript files
 */
function findJavaScriptFiles(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Skip certain directories
                if (!['node_modules', '.git', '.next', 'build', 'dist'].includes(file)) {
                    findJavaScriptFiles(filePath, fileList);
                }
            } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
                fileList.push(filePath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
    
    return fileList;
}

/**
 * Generate detailed report
 */
function generateReport() {
    console.log(`\n${colors.cyan}=== MongoDB Connection Migration Test Report ===${colors.reset}\n`);
    
    // Summary stats
    console.log(`${colors.blue}📊 Test Summary:${colors.reset}`);
    console.log(`   Total files tested: ${testResults.totalFiles}`);
    console.log(`   ${colors.green}✅ Passed: ${testResults.passedFiles}${colors.reset}`);
    console.log(`   ${colors.red}❌ Failed: ${testResults.failedFiles}${colors.reset}`);
    console.log(`   ${colors.yellow}⏭️  Excluded: ${testResults.excludedFiles}${colors.reset}`);
    
    // Success rate
    const successRate = testResults.totalFiles > 0 ? 
        ((testResults.passedFiles / testResults.totalFiles) * 100).toFixed(1) : 0;
    console.log(`   ${colors.magenta}📈 Success Rate: ${successRate}%${colors.reset}\n`);

    // Files using shared connections properly
    if (testResults.goodFiles.length > 0) {
        console.log(`${colors.green}✅ Files Using Shared Connections (${testResults.goodFiles.length}):${colors.reset}`);
        testResults.goodFiles.forEach(({ file, goodPatterns }) => {
            console.log(`   ${colors.green}✓${colors.reset} ${file} (${goodPatterns.length} good patterns)`);
        });
        console.log('');
    }

    // Files with issues
    if (testResults.badFiles.length > 0) {
        console.log(`${colors.red}❌ Files with Connection Issues (${testResults.badFiles.length}):${colors.reset}`);
        testResults.badFiles.forEach(({ file, issues }) => {
            console.log(`\n   ${colors.red}✗ ${file}${colors.reset}`);
            issues.forEach(issue => {
                const severityColor = issue.severity === 'HIGH' ? colors.red : colors.yellow;
                console.log(`     ${severityColor}[${issue.severity}]${colors.reset} ${issue.description}`);
                console.log(`     Pattern: ${issue.pattern}`);
                console.log(`     Match: "${issue.match}"`);
            });
        });
        console.log('');
    }

    // Issue breakdown by severity
    const highIssues = testResults.issues.filter(i => i.severity === 'HIGH').length;
    const mediumIssues = testResults.issues.filter(i => i.severity === 'MEDIUM').length;
    
    if (testResults.issues.length > 0) {
        console.log(`${colors.yellow}⚠️  Issue Breakdown:${colors.reset}`);
        console.log(`   ${colors.red}🔴 High Priority: ${highIssues}${colors.reset}`);
        console.log(`   ${colors.yellow}🟡 Medium Priority: ${mediumIssues}${colors.reset}`);
        console.log(`   Total Issues: ${testResults.issues.length}\n`);
    }

    // Recommendations
    console.log(`${colors.cyan}📝 Recommendations:${colors.reset}`);
    
    if (testResults.failedFiles === 0) {
        console.log(`   ${colors.green}🎉 Excellent! All files are using shared connections properly.${colors.reset}`);
        console.log(`   ${colors.green}✅ Your MongoDB connection migration is complete and working correctly.${colors.reset}`);
    } else {
        console.log(`   ${colors.yellow}1. Fix HIGH priority issues first - these indicate individual connections${colors.reset}`);
        console.log(`   ${colors.yellow}2. Update imports to use: import { getDatabase } from '../lib/mongodb'${colors.reset}`);
        console.log(`   ${colors.yellow}3. Replace 'new MongoClient()' with 'await getDatabase()'${colors.reset}`);
        console.log(`   ${colors.yellow}4. Remove client.connect() and client.close() calls${colors.reset}`);
    }

    console.log(`\n${colors.cyan}🔗 For migration help, see: docs/MONGODB_CONNECTION_MIGRATION.md${colors.reset}`);
    
    return testResults.failedFiles === 0;
}

/**
 * Run tests on specific directories
 */
function runTests() {
    console.log(`${colors.cyan}🔍 MongoDB Connection Migration Test Suite${colors.reset}\n`);
    console.log('Scanning for JavaScript files and testing MongoDB connection patterns...\n');

    // Test directories
    const testDirs = [
        'pages/api',
        'lib',
        'utils',
        'utilities',
        'components',
        'hooks'
    ];

    const allFiles = [];
    
    testDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            console.log(`Scanning ${dir}/...`);
            const files = findJavaScriptFiles(dir);
            allFiles.push(...files);
        }
    });

    console.log(`\nFound ${allFiles.length} JavaScript files to test.\n`);

    // Test each file
    let currentFile = 0;
    allFiles.forEach(file => {
        currentFile++;
        const result = testFile(file);
        
        // Progress indicator
        if (currentFile % 10 === 0 || currentFile === allFiles.length) {
            process.stdout.write(`\rTesting files... ${currentFile}/${allFiles.length}`);
        }

        // Show immediate feedback for files with issues
        if (result.status === 'fail' && result.hasMongoCode) {
            console.log(`\n${colors.red}❌ ISSUE FOUND:${colors.reset} ${file}`);
            result.issueDetails.forEach(issue => {
                console.log(`   ${colors.red}[${issue.severity}]${colors.reset} ${issue.description}`);
            });
        } else if (result.status === 'pass' && result.hasMongoCode && result.goodPatterns > 0) {
            console.log(`\n${colors.green}✅ GOOD:${colors.reset} ${file}`);
        }
    });

    console.log('\n');
    return generateReport();
}

/**
 * Main execution
 */
function main() {
    const startTime = Date.now();
    
    try {
        const allTestsPassed = runTests();
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n${colors.cyan}⏱️  Test completed in ${duration}s${colors.reset}`);
        
        if (allTestsPassed) {
            console.log(`\n${colors.green}🎉 SUCCESS: All MongoDB connections are properly migrated!${colors.reset}`);
            process.exit(0);
        } else {
            console.log(`\n${colors.red}💥 FAILURE: Some files still have individual MongoDB connections.${colors.reset}`);
            console.log(`${colors.yellow}Please fix the issues above and run the test again.${colors.reset}`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`\n${colors.red}❌ Test suite error:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Export for use in other scripts
module.exports = { testFile, runTests, findJavaScriptFiles };

// Run if called directly
if (require.main === module) {
    main();
}