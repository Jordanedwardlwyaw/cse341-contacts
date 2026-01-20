const Contact = require('../models/contact');

/**
 * @desc    Get all contacts
 * @route   GET /contacts
 * @access  Public
 */
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts.map(contact => ({
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        favoriteColor: contact.favoriteColor,
        birthday: contact.formattedBirthday,
        age: contact.age,
        fullName: contact.fullName,
        createdAt: contact.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single contact by ID
 * @route   GET /contacts/:id
 * @access  Public
 */
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: contact._id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        favoriteColor: contact.favoriteColor,
        birthday: contact.formattedBirthday,
        age: contact.age,
        fullName: contact.fullName,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Create new contact
 * @route   POST /contacts
 * @access  Public
 */
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate all required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }
    
    // Check if email already exists
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    const contact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday: new Date(birthday)
    });
    
    const newContact = await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      id: newContact._id,
      data: {
        id: newContact._id,
        firstName: newContact.firstName,
        lastName: newContact.lastName,
        email: newContact.email,
        favoriteColor: newContact.favoriteColor,
        birthday: newContact.formattedBirthday,
        age: newContact.age,
        fullName: newContact.fullName
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update contact
 * @route   PUT /contacts/:id
 * @access  Public
 */
const updateContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validate all required fields
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }
    
    let contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    // Check if email is being changed to another existing email
    if (email !== contact.email) {
      const emailExists = await Contact.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    // Update contact
    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.email = email;
    contact.favoriteColor = favoriteColor;
    contact.birthday = new Date(birthday);
    
    const updatedContact = await contact.save();
    
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: {
        id: updatedContact._id,
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        favoriteColor: updatedContact.favoriteColor,
        birthday: updatedContact.formattedBirthday,
        age: updatedContact.age,
        fullName: updatedContact.fullName,
        updatedAt: updatedContact.updatedAt
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete contact
 * @route   DELETE /contacts/:id
 * @access  Public
 */
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    await contact.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: {}
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};