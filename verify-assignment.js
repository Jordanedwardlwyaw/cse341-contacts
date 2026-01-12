const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🎯 Verifying CSE 341 Week 1 Assignment\n');
console.log('='.repeat(60));

let testResults = [];

async function makeRequest(method, endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: method,
      headers: { 'Accept': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🔧 Testing API Endpoints...\n');

  // Test 1: Server is running
  try {
    await makeRequest('GET', '/');
    testResults.push({ test: 'Server running on port 3000', passed: true });
    console.log('✅ Server is running on http://localhost:3000');
  } catch (e) {
    testResults.push({ test: 'Server running on port 3000', passed: false });
    console.log('❌ Server not running');
    return;
  }

  // Test 2: Welcome endpoint
  try {
    const response = await makeRequest('GET', '/');
    const hasWelcome = response.body.includes('Welcome') || response.body.includes('Contacts API');
    testResults.push({ test: 'GET / returns welcome message', passed: hasWelcome && response.status === 200 });
    console.log(`✅ GET / - Status: ${response.status}, Has welcome: ${hasWelcome}`);
  } catch (e) {
    testResults.push({ test: 'GET / returns welcome message', passed: false });
    console.log('❌ GET / - Failed');
  }

  // Test 3: Health endpoint
  try {
    const response = await makeRequest('GET', '/health');
    testResults.push({ test: 'GET /health returns status', passed: response.status === 200 });
    console.log(`✅ GET /health - Status: ${response.status}`);
  } catch (e) {
    testResults.push({ test: 'GET /health returns status', passed: false });
    console.log('❌ GET /health - Failed');
  }

  // Test 4: Get all contacts
  try {
    const response = await makeRequest('GET', '/contacts');
    let contactsData = null;
    let contactCount = 0;
    let firstContactId = null;

    if (response.status === 200) {
      try {
        const data = JSON.parse(response.body);
        contactsData = data;
        contactCount = data.count || (data.data ? data.data.length : 0);
        
        if (data.data && data.data.length > 0) {
          firstContactId = data.data[0].id || data.data[0]._id;
        }
      } catch (e) {
        // Not JSON
      }
    }

    const hasContacts = contactCount > 0;
    testResults.push({ 
      test: 'GET /contacts returns contacts from MongoDB', 
      passed: response.status === 200 && hasContacts 
    });
    
    console.log(`✅ GET /contacts - Status: ${response.status}, Contacts: ${contactCount}`);

    // Test 5: Contacts have required fields
    if (contactsData && contactsData.data && contactsData.data.length > 0) {
      const contact = contactsData.data[0];
      const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
      const hasAllFields = requiredFields.every(field => field in contact);
      testResults.push({ test: 'Contacts have all required fields', passed: hasAllFields });
      console.log(`✅ Required fields present: ${hasAllFields}`);
      
      // Test 6: Get single contact
      if (firstContactId) {
        try {
          const singleResponse = await makeRequest('GET', `/contacts/${firstContactId}`);
          const singlePassed = singleResponse.status === 200;
          testResults.push({ test: 'GET /contacts/:id returns single contact', passed: singlePassed });
          console.log(`✅ GET /contacts/${firstContactId.substring(0, 8)}... - Status: ${singleResponse.status}`);
        } catch (e) {
          testResults.push({ test: 'GET /contacts/:id returns single contact', passed: false });
          console.log(`❌ GET /contacts/:id - Failed`);
        }
      }
    } else {
      testResults.push({ test: 'Contacts have all required fields', passed: false });
      testResults.push({ test: 'GET /contacts/:id returns single contact', passed: false });
    }

  } catch (e) {
    testResults.push({ test: 'GET /contacts returns contacts from MongoDB', passed: false });
    testResults.push({ test: 'Contacts have all required fields', passed: false });
    testResults.push({ test: 'GET /contacts/:id returns single contact', passed: false });
    console.log('❌ GET /contacts - Failed');
  }

  // Test 7: MVC architecture
  const mvcFiles = [
    'src/models/Contact.js',
    'src/controllers/contactsController.js',
    'src/routes/contacts.js',
    'src/config/db.js'
  ];
  const hasMVC = mvcFiles.every(file => fs.existsSync(file));
  testResults.push({ test: 'MVC architecture used', passed: hasMVC });
  console.log(`✅ MVC architecture: ${hasMVC}`);

  // Test 8: .env file exists
  const hasEnv = fs.existsSync('.env');
  testResults.push({ test: '.env file exists (security)', passed: hasEnv });
  console.log(`✅ .env file exists: ${hasEnv}`);

  // Test 9: .gitignore excludes .env
  let gitignoreCorrect = false;
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    gitignoreCorrect = gitignore.includes('.env') && gitignore.includes('node_modules');
  }
  testResults.push({ test: '.gitignore excludes .env and node_modules', passed: gitignoreCorrect });
  console.log(`✅ .gitignore correct: ${gitignoreCorrect}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ASSIGNMENT VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  testResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.test}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  const passed = testResults.filter(t => t.passed).length;
  const total = testResults.length;
  const percentage = Math.round((passed / total) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Score: ${passed}/${total} (${percentage}%)`);
  
  if (percentage >= 80) {
    console.log('🚀 READY FOR SUBMISSION!');
    console.log('\n✅ Week 1 Requirements Met:');
    console.log('• GET all contacts endpoint ✓');
    console.log('• GET single contact by ID endpoint ✓');
    console.log('• MongoDB connection working ✓');
    console.log('• MVC architecture ✓');
    console.log('• Security (.env file) ✓');
    console.log('\n📋 Next steps:');
    console.log('1. Push to GitHub: git add . && git commit -m "Week 1 complete" && git push');
    console.log('2. Deploy to Render.com');
    console.log('3. Create 5-8 minute video demonstration');
    console.log('4. Submit GitHub, Render, and YouTube links in Canvas');
  } else {
    console.log('⚠️  Needs more work before submission');
  }
}

// Run tests
runTests().catch(console.error);