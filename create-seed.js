require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('./src/models/Contact');

const sampleContacts = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    favoriteColor: 'Blue',
    birthday: new Date('1990-01-15')
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    favoriteColor: 'Green',
    birthday: new Date('1985-05-20')
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    favoriteColor: 'Red',
    birthday: new Date('1992-11-30')
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@example.com',
    favoriteColor: 'Purple',
    birthday: new Date('1988-07-10')
  },
  {
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.wilson@example.com',
    favoriteColor: 'Orange',
    birthday: new Date('1995-03-25')
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    
    // Clear existing contacts
    console.log('Clearing existing contacts...');
    await Contact.deleteMany({});
    console.log('✅ Database cleared');
    
    // Insert sample contacts
    console.log('Inserting sample contacts...');
    await Contact.insertMany(sampleContacts);
    console.log(`✅ Inserted ${sampleContacts.length} contacts`);
    
    // Display inserted contacts
    const contacts = await Contact.find({});
    console.log('\n📋 Contacts in database:');
    console.log('='.repeat(50));
    contacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.firstName} ${contact.lastName}`);
      console.log(`   Email: ${contact.email}`);
      console.log(`   Favorite Color: ${contact.favoriteColor}`);
      console.log(`   Birthday: ${contact.birthday.toDateString()}`);
      console.log(`   ID: ${contact._id}`);
      console.log('-'.repeat(50));
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Handle async errors
seedDatabase().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});