require('dotenv').config();

console.log('Checking .env file...');
console.log('Current directory:', __dirname);
console.log('MONGODB_URI exists?', !!process.env.MONGODB_URI);
console.log('MONGODB_URI value:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'NOT SET');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check .env file path
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

console.log('\n.env file exists?', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  console.log('.env file content (first 100 chars):');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log(content.substring(0, 100) + '...');
}