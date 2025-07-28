#!/usr/bin/env node

/**
 * Functional API Connection Test Suite
 * 
 * This script makes actual HTTP requests to all your API endpoints to verify
 * they're working correctly with the shared MongoDB connection system.
 * 
 * Usage: node scripts/test-api-connections.js [--host=localhost:3000]
 */

const http = require('http');
const https = require('https');
const url = require('url');

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

// Configuration
const DEFAULT_HOST = 'localhost:3000';
const DEFAULT_PROTOCOL = 'http:';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * API endpoints to test with their expected behavior
 */
const API_TESTS = [
    {
        path: '/api/health/mongodb',
        method: 'GET',
        description: 'MongoDB Health Check',
        expectStatus: 200,
        expectKeys: ['status', 'mongodb', 'connectionPool'],
        critical: true
    },
    {
        path: '/api/players/search?name=lebron&sport=nba',
        method: 'GET',
        description: 'Player Search API',
        expectStatus: 200,
        expectKeys: ['players'],
        critical: true
    },
    {
        path: '/api/players/list?sport=nba&limit=5',
        method: 'GET',
        description: 'Player List API',
        expectStatus: 200,
        expectKeys: ['players', 'pagination'],
        critical: true
    },
    {
        path: '/api/fetch/NBA/GetAllPlayers',
        method: 'GET',
        description: 'NBA All Players API',
        expectStatus: 200,
        expectKeys: ['success', 'data'],
        critical: true
    },
    {
        path: '/api/rankings/latest?sport=NBA&format=Dynasty&scoring=Categories',
        method: 'GET',
        description: 'Latest Rankings API',
        expectStatus: [200, 404], // 404 is OK if no rankings exist
        expectKeys: null, // Variable response structure
        critical: false
    },
    {
        path: '/api/fetch/fetchExpertRankings?sport=NBA&format=Dynasty&scoring=Categories',
        method: 'GET',
        description: 'Expert Rankings API',
        expectStatus: [200, 404], // 404 is OK if no rankings exist
        expectKeys: null,
        critical: false
    },
    // Note: User-protected endpoints would need authentication, so we skip them
    // {
    //     path: '/api/user-rankings',
    //     method: 'GET',
    //     description: 'User Rankings API (requires auth)',
    //     expectStatus: 401, // Unauthorized without auth
    //     critical: false
    // }
];

/**
 * Test results storage
 */
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    results: []
};

/**
 * Make HTTP request
 */
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const protocol = options.protocol === 'https:' ? https : http;
        const timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
        }, REQUEST_TIMEOUT);

        const req = protocol.request(options, (res) => {
            clearTimeout(timeoutId);
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData,
                        rawData: data
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: null,
                        rawData: data,
                        parseError: error.message
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            clearTimeout(timeoutId);
            reject(error);
        });
        
        req.setTimeout(REQUEST_TIMEOUT, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

/**
 * Test a single API endpoint
 */
async function testEndpoint(test, baseUrl) {
    const testUrl = url.parse(baseUrl + test.path);
    const options = {
        hostname: testUrl.hostname,
        port: testUrl.port,
        path: testUrl.path,
        method: test.method,
        protocol: testUrl.protocol,
        headers: {
            'User-Agent': 'MongoDB-Connection-Test-Suite/1.0',
            'Accept': 'application/json'
        }
    };

    testResults.total++;
    
    try {
        console.log(`\n${colors.blue}Testing:${colors.reset} ${test.description}`);
        console.log(`${colors.cyan}URL:${colors.reset} ${test.method} ${baseUrl}${test.path}`);
        
        const startTime = Date.now();
        const response = await makeRequest(options);
        const duration = Date.now() - startTime;
        
        const result = {
            test: test.description,
            path: test.path,
            method: test.method,
            duration,
            success: false,
            details: {},
            response
        };

        // Check status code
        const expectedStatuses = Array.isArray(test.expectStatus) ? test.expectStatus : [test.expectStatus];
        const statusOk = expectedStatuses.includes(response.statusCode);
        
        if (!statusOk) {
            result.details.statusError = `Expected ${test.expectStatus}, got ${response.statusCode}`;
        }

        // Check required keys in response
        let keysOk = true;
        if (test.expectKeys && response.data && typeof response.data === 'object') {
            const missingKeys = test.expectKeys.filter(key => !(key in response.data));
            if (missingKeys.length > 0) {
                keysOk = false;
                result.details.missingKeys = missingKeys;
            }
        }

        // Overall success determination
        result.success = statusOk && keysOk;
        
        if (result.success) {
            testResults.passed++;
            console.log(`${colors.green}✅ PASS${colors.reset} (${duration}ms) - Status: ${response.statusCode}`);
            
            // Show some response details for successful tests
            if (response.data) {
                if (response.data.mongodb) {
                    console.log(`   MongoDB Connected: ${response.data.mongodb.connected}`);
                }
                if (response.data.data && typeof response.data.data === 'object') {
                    const dataLength = Array.isArray(response.data.data) ? response.data.data.length : 'object';
                    console.log(`   Data returned: ${dataLength} items/records`);
                }
                if (response.data.players) {
                    console.log(`   Players returned: ${response.data.players.length}`);
                }
            }
        } else {
            testResults.failed++;
            console.log(`${colors.red}❌ FAIL${colors.reset} (${duration}ms) - Status: ${response.statusCode}`);
            
            if (result.details.statusError) {
                console.log(`   ${colors.red}Status Error:${colors.reset} ${result.details.statusError}`);
            }
            if (result.details.missingKeys) {
                console.log(`   ${colors.red}Missing Keys:${colors.reset} ${result.details.missingKeys.join(', ')}`);
            }
            if (response.parseError) {
                console.log(`   ${colors.red}Parse Error:${colors.reset} ${response.parseError}`);
            }
            if (response.data && response.data.error) {
                console.log(`   ${colors.red}API Error:${colors.reset} ${response.data.error}`);
            }
        }

        testResults.results.push(result);
        return result;
        
    } catch (error) {
        testResults.failed++;
        console.log(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
        
        const result = {
            test: test.description,
            path: test.path,
            method: test.method,
            success: false,
            error: error.message
        };
        
        testResults.results.push(result);
        return result;
    }
}

/**
 * Check if server is running
 */
async function checkServer(baseUrl) {
    try {
        const testUrl = url.parse(baseUrl + '/api/health/mongodb');
        const options = {
            hostname: testUrl.hostname,
            port: testUrl.port,
            path: '/api/health/mongodb',
            method: 'GET',
            protocol: testUrl.protocol,
            timeout: 5000
        };
        
        await makeRequest(options);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Generate test report
 */
function generateReport() {
    console.log(`\n${colors.cyan}=== API Functional Test Report ===${colors.reset}\n`);
    
    // Summary
    console.log(`${colors.blue}📊 Test Summary:${colors.reset}`);
    console.log(`   Total tests: ${testResults.total}`);
    console.log(`   ${colors.green}✅ Passed: ${testResults.passed}${colors.reset}`);
    console.log(`   ${colors.red}❌ Failed: ${testResults.failed}${colors.reset}`);
    
    if (testResults.total > 0) {
        const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
        console.log(`   ${colors.magenta}📈 Success Rate: ${successRate}%${colors.reset}`);
    }

    // Performance summary
    const successfulTests = testResults.results.filter(r => r.success && r.duration);
    if (successfulTests.length > 0) {
        const avgDuration = (successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length).toFixed(0);
        const maxDuration = Math.max(...successfulTests.map(r => r.duration));
        const minDuration = Math.min(...successfulTests.map(r => r.duration));
        
        console.log(`\n${colors.blue}⚡ Performance:${colors.reset}`);
        console.log(`   Average response time: ${avgDuration}ms`);
        console.log(`   Fastest response: ${minDuration}ms`);
        console.log(`   Slowest response: ${maxDuration}ms`);
    }

    // Critical failures
    const criticalFailures = testResults.results.filter(r => !r.success && 
        API_TESTS.find(t => t.path === r.path)?.critical);
    
    if (criticalFailures.length > 0) {
        console.log(`\n${colors.red}🚨 Critical Failures:${colors.reset}`);
        criticalFailures.forEach(failure => {
            console.log(`   ${colors.red}✗${colors.reset} ${failure.test}`);
        });
    }

    // Recommendations
    console.log(`\n${colors.cyan}📝 Recommendations:${colors.reset}`);
    
    if (testResults.failed === 0) {
        console.log(`   ${colors.green}🎉 Excellent! All API endpoints are working correctly.${colors.reset}`);
        console.log(`   ${colors.green}✅ Your MongoDB connection migration is functional.${colors.reset}`);
    } else {
        console.log(`   ${colors.yellow}1. Check failed endpoints for connection issues${colors.reset}`);
        console.log(`   ${colors.yellow}2. Verify your app server is running correctly${colors.reset}`);
        console.log(`   ${colors.yellow}3. Check MongoDB connection string and permissions${colors.reset}`);
        if (criticalFailures.length > 0) {
            console.log(`   ${colors.red}4. Fix critical failures first - these affect core functionality${colors.reset}`);
        }
    }

    return testResults.failed === 0;
}

/**
 * Main test runner
 */
async function runTests() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let host = DEFAULT_HOST;
    let protocol = DEFAULT_PROTOCOL;
    
    args.forEach(arg => {
        if (arg.startsWith('--host=')) {
            host = arg.replace('--host=', '');
        }
        if (arg.startsWith('--https')) {
            protocol = 'https:';
        }
    });
    
    const baseUrl = `${protocol}//${host}`;
    
    console.log(`${colors.cyan}🔗 API Functional Test Suite${colors.reset}\n`);
    console.log(`Testing API endpoints at: ${baseUrl}\n`);
    
    // Check if server is running
    console.log('Checking if server is running...');
    const serverRunning = await checkServer(baseUrl);
    
    if (!serverRunning) {
        console.log(`${colors.red}❌ Server not reachable at ${baseUrl}${colors.reset}`);
        console.log(`${colors.yellow}Please start your development server with: npm run dev${colors.reset}`);
        process.exit(1);
    }
    
    console.log(`${colors.green}✅ Server is running${colors.reset}\n`);
    
    // Run all tests
    for (const test of API_TESTS) {
        await testEndpoint(test, baseUrl);
        
        // Small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return generateReport();
}

/**
 * Main execution
 */
async function main() {
    try {
        const startTime = Date.now();
        const allTestsPassed = await runTests();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`\n${colors.cyan}⏱️  Tests completed in ${duration}s${colors.reset}`);
        
        if (allTestsPassed) {
            console.log(`\n${colors.green}🎉 SUCCESS: All API endpoints are working correctly!${colors.reset}`);
            process.exit(0);
        } else {
            console.log(`\n${colors.red}💥 FAILURE: Some API endpoints have issues.${colors.reset}`);
            console.log(`${colors.yellow}Check the failed tests above and fix any connection issues.${colors.reset}`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`\n${colors.red}❌ Test runner error:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { testEndpoint, runTests, checkServer };