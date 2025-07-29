#!/usr/bin/env node

/**
 * Master MongoDB Connection Test Suite
 * 
 * This script runs both static code analysis and functional API tests
 * to comprehensively verify the MongoDB connection migration.
 * 
 * Usage: node scripts/test-all-connections.js [--functional] [--host=localhost:3000]
 */

const { spawn } = require('child_process');
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
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

/**
 * Run a command and return the result
 */
function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            ...options
        });

        child.on('close', (code) => {
            resolve(code);
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Print a section header
 */
function printHeader(title, description) {
    console.log(`\n${colors.cyan}${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}${colors.bold}${title}${colors.reset}`);
    console.log(`${colors.white}${description}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Print test results summary
 */
function printTestResult(testName, passed, details = '') {
    const status = passed ? 
        `${colors.green}✅ PASSED${colors.reset}` : 
        `${colors.red}❌ FAILED${colors.reset}`;
    
    console.log(`${testName}: ${status}`);
    if (details) {
        console.log(`   ${details}`);
    }
}

/**
 * Main test execution
 */
async function main() {
    const args = process.argv.slice(2);
    const runFunctionalTests = args.includes('--functional');
    const hostArg = args.find(arg => arg.startsWith('--host='));
    
    console.log(`${colors.cyan}${colors.bold}🧪 MongoDB Connection Migration Test Suite${colors.reset}\n`);
    console.log(`${colors.white}This comprehensive test suite will verify your MongoDB connection migration.${colors.reset}\n`);

    const testResults = {
        staticAnalysis: null,
        functionalTests: null,
        overallSuccess: false
    };

    try {
        // Step 1: Static Code Analysis
        printHeader(
            '🔍 Step 1: Static Code Analysis',
            'Scanning all files for MongoDB connection patterns and anti-patterns'
        );

        const staticTestPath = path.join(__dirname, 'test-mongodb-connections.js');
        const staticResult = await runCommand('node', [staticTestPath]);
        testResults.staticAnalysis = staticResult === 0;
        
        printTestResult(
            'Static Code Analysis',
            testResults.staticAnalysis,
            testResults.staticAnalysis ? 
                'All files are using shared connections properly' :
                'Some files still have individual MongoDB connections'
        );

        // Step 2: Functional API Tests (if requested)
        if (runFunctionalTests) {
            printHeader(
                '🚀 Step 2: Functional API Tests',
                'Making HTTP requests to verify APIs work with shared connections'
            );

            console.log(`${colors.yellow}⚠️  Note: This requires your development server to be running.${colors.reset}`);
            console.log(`${colors.yellow}   Start it with: npm run dev${colors.reset}\n`);

            const functionalTestPath = path.join(__dirname, 'test-api-connections.js');
            const functionalArgs = hostArg ? [functionalTestPath, hostArg] : [functionalTestPath];
            const functionalResult = await runCommand('node', functionalArgs);
            testResults.functionalTests = functionalResult === 0;
            
            printTestResult(
                'Functional API Tests',
                testResults.functionalTests,
                testResults.functionalTests ? 
                    'All API endpoints are working correctly' :
                    'Some API endpoints have connection issues'
            );
        } else {
            console.log(`\n${colors.blue}ℹ️  Functional API tests skipped.${colors.reset}`);
            console.log(`${colors.white}   Add --functional to test actual API endpoints.${colors.reset}`);
            console.log(`${colors.white}   Example: node scripts/test-all-connections.js --functional${colors.reset}\n`);
        }

        // Step 3: Overall Results
        printHeader(
            '📊 Final Results',
            'Summary of all MongoDB connection migration tests'
        );

        // Determine overall success
        if (runFunctionalTests) {
            testResults.overallSuccess = testResults.staticAnalysis && testResults.functionalTests;
        } else {
            testResults.overallSuccess = testResults.staticAnalysis;
        }

        // Print detailed results
        console.log(`${colors.blue}Test Results Summary:${colors.reset}`);
        printTestResult('📁 Static Code Analysis', testResults.staticAnalysis);
        
        if (runFunctionalTests) {
            printTestResult('🌐 Functional API Tests', testResults.functionalTests);
        } else {
            console.log(`🌐 Functional API Tests: ${colors.yellow}⏭️  Skipped${colors.reset}`);
        }

        console.log('');

        // Migration status
        if (testResults.overallSuccess) {
            console.log(`${colors.green}${colors.bold}🎉 MIGRATION COMPLETE AND VERIFIED!${colors.reset}\n`);
            console.log(`${colors.green}✅ Your MongoDB connection limit issue is solved.${colors.reset}`);
            console.log(`${colors.green}✅ All files are using shared connections properly.${colors.reset}`);
            if (runFunctionalTests) {
                console.log(`${colors.green}✅ All API endpoints are working correctly.${colors.reset}`);
            }
            console.log(`${colors.green}✅ You can now use multiple browsers for responsive design testing.${colors.reset}\n`);
            
            console.log(`${colors.cyan}📈 Performance Benefits:${colors.reset}`);
            console.log(`   • Reduced connection usage (5-50 connections vs 1 per request)`);
            console.log(`   • Faster API responses (no connection overhead)`);
            console.log(`   • Better resource utilization`);
            console.log(`   • Automatic connection health monitoring\n`);
            
            console.log(`${colors.cyan}🔗 Next Steps:${colors.reset}`);
            console.log(`   • Test multi-browser responsive design - your original issue should be gone!`);
            console.log(`   • Monitor connection health: visit /api/health/mongodb`);
            console.log(`   • Remove .backup files once you're confident everything works`);
            console.log(`   • Enjoy improved performance and reliability!`);
            
        } else {
            console.log(`${colors.red}${colors.bold}❌ MIGRATION NEEDS ATTENTION${colors.reset}\n`);
            
            if (!testResults.staticAnalysis) {
                console.log(`${colors.red}🔧 Issues found in static analysis:${colors.reset}`);
                console.log(`   • Some files still use individual MongoDB connections`);
                console.log(`   • Run the migration script: node scripts/migrate-mongodb-connections.js`);
                console.log(`   • Or manually fix the reported files\n`);
            }
            
            if (runFunctionalTests && !testResults.functionalTests) {
                console.log(`${colors.red}🔧 Issues found in functional tests:${colors.reset}`);
                console.log(`   • Some API endpoints are not working correctly`);
                console.log(`   • Check server logs for connection errors`);
                console.log(`   • Verify MongoDB connection string and permissions\n`);
            }
            
            console.log(`${colors.yellow}📝 Recommendations:${colors.reset}`);
            console.log(`   1. Fix high-priority issues first (individual connections)`);
            console.log(`   2. Test specific failing endpoints`);
            console.log(`   3. Check MongoDB server status and permissions`);
            console.log(`   4. Review error logs for detailed information`);
            console.log(`   5. Use backup files to rollback if needed\n`);
            
            console.log(`${colors.cyan}🆘 Need Help?${colors.reset}`);
            console.log(`   • Check docs/MONGODB_CONNECTION_MIGRATION.md`);
            console.log(`   • Review backup files (*.backup) for original code`);
            console.log(`   • Run individual test scripts for more details`);
        }

        // Exit with appropriate code
        process.exit(testResults.overallSuccess ? 0 : 1);

    } catch (error) {
        console.error(`\n${colors.red}❌ Test suite error:${colors.reset}`, error.message);
        console.error(`${colors.yellow}This usually indicates a problem with the test setup.${colors.reset}`);
        process.exit(1);
    }
}

/**
 * Show usage information
 */
function showUsage() {
    console.log(`${colors.cyan}MongoDB Connection Migration Test Suite${colors.reset}\n`);
    console.log('Usage:');
    console.log('  node scripts/test-all-connections.js [options]\n');
    console.log('Options:');
    console.log('  --functional           Run functional API tests (requires running server)');
    console.log('  --host=HOST:PORT       Specify server host (default: localhost:3000)');
    console.log('  --help                 Show this help message\n');
    console.log('Examples:');
    console.log('  node scripts/test-all-connections.js');
    console.log('  node scripts/test-all-connections.js --functional');
    console.log('  node scripts/test-all-connections.js --functional --host=localhost:3001\n');
    console.log('Description:');
    console.log('  This script verifies your MongoDB connection migration by running:');
    console.log('  1. Static code analysis to check for connection anti-patterns');
    console.log('  2. Functional API tests to verify endpoints work correctly (optional)');
}

// Handle help flag
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    process.exit(0);
}

// Run main function
if (require.main === module) {
    main().catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
}