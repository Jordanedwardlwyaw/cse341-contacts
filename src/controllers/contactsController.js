const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /contacts
// @access  Public
const getAllContacts = async (req, res) => {
  try {
    console.log('📥 GET /contacts request received');
    
    // Get all contacts from database
    const contacts = await Contact.find({}).sort({ lastName: 1, firstName: 1 });
    
    console.log(`📊 Found ${contacts.length} contacts`);
    
    // Format the response
    const formattedContacts = contacts.map(contact => ({
      id: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      fullName: contact.fullName,
      email: contact.email,
      favoriteColor: contact.favoriteColor,
      birthday: contact.formattedBirthday,
      age: contact.age,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }));
    
    res.status(200).json({
      success: true,
      count: formattedContacts.length,
      data: formattedContacts,
      message: `Found ${formattedContacts.length} contacts`
    });
    
  } catch (error) {
    console.error('❌ Error in getAllContacts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not retrieve contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single contact by ID
// @route   GET /contacts/:id
// @access  Public
const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(`📥 GET /contacts/${contactId} request received`);
    
    // Validate ID format
    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format. Must be a 24-character hexadecimal string.'
      });
    }
    
    // Find contact by ID
    const contact = await Contact.findById(contactId);
    
    // Check if contact exists
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `Contact not found with ID: ${contactId}`
      });
    }
    
    console.log(`✅ Found contact: ${contact.fullName}`);
    
    // Format the response
    const formattedContact = {
      id: contact._id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      fullName: contact.fullName,
      email: contact.email,
      favoriteColor: contact.favoriteColor,
      birthday: contact.formattedBirthday,
      age: contact.age,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    };
    
    res.status(200).json({
      success: true,
      data: formattedContact,
      message: 'Contact retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error in getContactById:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error - Could not retrieve contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById
};