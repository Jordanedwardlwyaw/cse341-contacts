const router = require('express').Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middleware/auth');

// Week 1 Routes
router.get('/', contactController.getAll);
router.get('/:id', contactController.getSingle);

// Week 2/4 Routes (Protected)
router.post('/', isAuthenticated, contactController.createContact);
router.put('/:id', isAuthenticated, contactController.updateContact);
router.delete('/:id', isAuthenticated, contactController.deleteContact);

module.exports = router;