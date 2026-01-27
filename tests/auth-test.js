// tests/auth-test.js
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function runAuthTests() {
    console.log('🔐 Testing Authentication System\n');
    
    try {
        // Test 1: Check server is running
        console.log('1. Testing server health...');
        const health = await axios.get(`${API_BASE}/health`);
        console.log(`✅ Server is ${health.data.status}\n`);
        
        // Test 2: Test public book access
        console.log('2. Testing public book access...');
        const books = await axios.get(`${API_BASE}/api/books`);
        console.log(`✅ Can access ${books.data.count || 0} books publicly\n`);
        
        // Test 3: Test protected endpoint without auth
        console.log('3. Testing protected endpoint (should fail)...');
        try {
            await axios.post(`${API_BASE}/api/books`, {
                title: "Unauthorized Book"
            });
            console.log('❌ Should have failed!\n');
        } catch (error) {
            if (error.response.status === 401) {
                console.log('✅ Correctly requires authentication\n');
            }
        }
        
        // Test 4: Check auth status
        console.log('4. Checking authentication status...');
        try {
            await axios.get(`${API_BASE}/auth/current`);
        } catch (error) {
            if (error.response.status === 401) {
                console.log('✅ Not authenticated (as expected)\n');
            }
        }
        
        // Test 5: Check OAuth endpoints
        console.log('5. Checking OAuth endpoints...');
        console.log(`📎 Google OAuth: ${API_BASE}/auth/google`);
        console.log(`📎 Login page: ${API_BASE}/login`);
        console.log(`📎 Logout: ${API_BASE}/auth/logout\n`);
        
        console.log('🎯 Manual Testing Required:');
        console.log('1. Visit the Google OAuth link above');
        console.log('2. Authenticate with Google');
        console.log('3. Try protected endpoints');
        console.log('4. Test logout functionality');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runAuthTests();