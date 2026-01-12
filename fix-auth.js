const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔐 Fixing MongoDB Authentication\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Get your password from MongoDB Atlas:');
console.log('1. Go to https://cloud.mongodb.com');
console.log('2. Database Access → cse341_user → Edit → Reset Password');
console.log('3. Copy the new password\n');

rl.question('Enter your NEW MongoDB password: ', (password) => {
  // URL encode special characters
  const encodedPassword = encodeURIComponent(password);
  console.log('\nOriginal password:', '*'.repeat(password.length));
  console.log('Encoded password:', encodedPassword);
  
  // Create connection string
  const connectionString = `mongodb+srv://cse341_user:${encodedPassword}@cluster0.fdt4p5n.mongodb.net/contactsDB?retryWrites=true&w=majority`;
  
  const envContent = `MONGODB_URI=${connectionString}
PORT=3000
NODE_ENV=development`;
  
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Updated .env file with new password');
  console.log('\nConnection string (first part):', connectionString.substring(0, 60) + '...');
  
  // Test the connection
  console.log('\n🧪 Testing connection...');
  
  const mongoose = require('mongoose');
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB');
    console.log('Database:', mongoose.connection.name);
    mongoose.connection.close();
    console.log('\n🚀 Now restart your server:');
    console.log('npm run dev');
  })
  .catch(err => {
    console.error('❌ Still failing:', err.message);
    console.log('\n⚠️  Other things to check:');
    console.log('1. Go to MongoDB Atlas → Network Access');
    console.log('2. Add IP Address: 0.0.0.0/0 (allow from anywhere)');
    console.log('3. Wait 1-2 minutes after adding IP');
  })
  .finally(() => {
    rl.close();
  });
});