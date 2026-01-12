const express = require('express');
const router = express.Router();
const { 
  getAllContacts, 
  getContactById 
} = require('../controllers/contactsController');

/**
 * @route   GET /contacts
 * @desc    Get all contacts
 * @access  Public
 * @response {Object} JSON object containing contacts array
 * @example
 * // Response example:
 * {
 *   "success": true,
 *   "count": 5,
 *   "data": [
 *     {
 *       "id": "507f1f77bcf86cd799439011",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john@example.com",
 *       "favoriteColor": "Blue",
 *       "birthday": "1990-01-15",
 *       "age": 33
 *     }
 *   ]
 * }
 */
router.get('/', getAllContacts);

/**
 * @route   GET /contacts/:id
 * @desc    Get a single contact by ID
 * @access  Public
 * @param   {string} id - Contact's MongoDB ObjectId
 * @response {Object} JSON object containing contact data
 * @example
 * // Request: GET /contacts/507f1f77bcf86cd799439011
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john@example.com",
 *     "favoriteColor": "Blue",
 *     "birthday": "1990-01-15",
 *     "age": 33
 *   }
 * }
 */
router.get('/:id', getContactById);

module.exports = router;