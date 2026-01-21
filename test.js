console.log('Testing contact model require...');
try {
  const Contact = require('./src/models/contact');
  console.log('✅ SUCCESS: Contact model loaded');
  console.log('Model name:', Contact.modelName);
} catch (error) {
  console.log('❌ ERROR:', error.message);
}
