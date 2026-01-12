const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envPath = path.join(__dirname, '.env');

console.log('🛠️  Fixing .env file...\n');

// Get the password from user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your MongoDB password: ', (password) => {
  const envContent = `MONGODB_URI=mongodb+srv://cse341_user:${password}@cluster0.fdt4p5n.mongodb.net/contactsDB?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
NODE_ENV=development
  
# Connection string explanation:
# mongodb+srv:// - MongoDB protocol
# cse341_user - Your username
# ${password.replace(/./g, '*')} - Your password (hidden)
# cluster0.fdt4p5n.mongodb.net - Your cluster
# contactsDB - Database name
# ?retryWrites=true&w=majority - Connection options
# &appName=Cluster0 - Application name`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file updated successfully!');
  console.log('\n📋 New .env file created with your password.');
  console.log('Now run: npm run seed');
  
  rl.close();
});