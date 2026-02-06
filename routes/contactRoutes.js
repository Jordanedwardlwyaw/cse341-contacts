const router = require('express').Router();
const contactsController = require('../controllers/contacts');
const { contactValidationRules, validate } = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// Public routes
router.get('/', contactsController.getAll);
router.get('/:id', contactsController.getSingle);

// Protected and Validated routes
router.post('/', isAuthenticated, contactValidationRules(), validate, contactsController.createContact);
router.put('/:id', isAuthenticated, contactValidationRules(), validate, contactsController.updateContact);
router.delete('/:id', isAuthenticated, contactsController.deleteContact);

module.exports = router;