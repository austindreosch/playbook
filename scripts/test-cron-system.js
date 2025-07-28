#!/usr/bin/env node

/**
 * Cron System Test Script
 * 
 * This script tests the cron job system functionality:
 * - Tests status endpoint
 * - Tests manual trigger functionality
 * - Validates environment variables
 * - Checks API connectivity
 * 
 * Usage: node scripts/test-cron-system.js
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    adminSecret: process.env.ADMIN_SECRET,
    cronSecret: process.env.CRON_SECRET,
    internalSecret: process.env.INTERNAL_API_SECRET
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https');
        const lib = isHttps ? https : http;
        
        const req = lib.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

// Test functions
async function testEnvironmentVariables() {
    console.log('\n🔧 Testing Environment Variables...');
    
    const requiredVars = [
        'MONGODB_URI',
        'MYSPORTSFEEDS_API_KEY',
        'MYSPORTSFEEDS_API_VERSION',
        'MYSPORTSFEEDS_NBA_SEASON',
        'CRON_SECRET',
        'INTERNAL_API_SECRET'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.log('❌ Missing environment variables:', missing.join(', '));
        return false;
    }
    
    console.log('✅ All required environment variables are set');
    return true;
}

async function testStatusEndpoint() {
    console.log('\n📊 Testing Status Endpoint...');
    
    try {
        const response = await makeRequest(`${config.baseUrl}/api/cron/status`);
        
        if (response.status === 200) {
            console.log('✅ Status endpoint is accessible');
            console.log(`   Database: ${response.data.systemHealth?.database || 'unknown'}`);
            console.log(`   MySportsFeeds: ${response.data.systemHealth?.mysportsfeeds || 'unknown'}`);
            
            // Check data status
            const sports = ['nba', 'nfl', 'mlb'];
            sports.forEach(sport => {
                const sportData = response.data.dataStatus?.[sport];
                if (sportData) {
                    console.log(`   ${sport.toUpperCase()}: ${sportData.status} (${sportData.recordCount || 0} records)`);
                }
            });
            
            return true;
        } else {
            console.log(`❌ Status endpoint failed: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Status endpoint error: ${error.message}`);
        return false;
    }
}

async function testManualTrigger(sport = 'nba') {
    console.log(`\n🔧 Testing Manual Trigger (${sport.toUpperCase()})...`);
    
    if (!config.adminSecret) {
        console.log('❌ ADMIN_SECRET not set, skipping manual trigger test');
        return false;
    }
    
    try {
        const response = await makeRequest(`${config.baseUrl}/api/cron/trigger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.adminSecret}`
            },
            body: JSON.stringify({ job: sport })
        });
        
        if (response.status === 200) {
            console.log(`✅ Manual trigger for ${sport.toUpperCase()} successful`);
            console.log(`   Duration: ${response.data.duration}ms`);
            console.log(`   Records processed: ${response.data.result?.recordsProcessed || 'unknown'}`);
            return true;
        } else {
            console.log(`❌ Manual trigger failed: ${response.status}`);
            console.log(`   Error: ${response.data?.error || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Manual trigger error: ${error.message}`);
        return false;
    }
}

async function testCronAuthentication() {
    console.log('\n🔐 Testing Cron Authentication...');
    
    if (!config.cronSecret) {
        console.log('❌ CRON_SECRET not set, skipping auth test');
        return false;
    }
    
    try {
        // Test with correct auth
        const response = await makeRequest(`${config.baseUrl}/api/cron/nba-update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.cronSecret}`,
                'Content-Type': 'application/json'
            }
        });
        
        // Should either succeed or fail with business logic, not auth error
        if (response.status !== 401) {
            console.log('✅ Cron authentication is working correctly');
            return true;
        } else {
            console.log('❌ Cron authentication failed');
            return false;
        }
    } catch (error) {
        console.log(`❌ Cron auth test error: ${error.message}`);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Cron System Tests...');
    console.log(`   Base URL: ${config.baseUrl}`);
    
    const results = {
        envVars: await testEnvironmentVariables(),
        status: await testStatusEndpoint(),
        cronAuth: await testCronAuthentication(),
        manualTrigger: false // Will be set below
    };
    
    // Only test manual trigger if other tests pass
    if (results.envVars && results.status) {
        console.log('\n⚠️  The next test will trigger an actual data update (NBA).');
        console.log('   This will make real API calls and update your database.');
        console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        results.manualTrigger = await testManualTrigger('nba');
    } else {
        console.log('\n⏭️  Skipping manual trigger test due to previous failures');
    }
    
    // Summary
    console.log('\n📋 Test Summary:');
    console.log(`   Environment Variables: ${results.envVars ? '✅' : '❌'}`);
    console.log(`   Status Endpoint: ${results.status ? '✅' : '❌'}`);
    console.log(`   Cron Authentication: ${results.cronAuth ? '✅' : '❌'}`);
    console.log(`   Manual Trigger: ${results.manualTrigger ? '✅' : '⏭️ '}`);
    
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Your cron system is ready to deploy.');
    } else {
        console.log('🔧 Some tests failed. Please review the issues above before deploying.');
    }
    
    return passed === total;
}

// Run tests if this script is executed directly
if (require.main === module) {
    runAllTests()
        .then(success => process.exit(success ? 0 : 1))
        .catch(error => {
            console.error('💥 Test runner crashed:', error.message);
            process.exit(1);
        });
}

module.exports = { runAllTests };