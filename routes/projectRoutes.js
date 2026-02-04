const express = require('express');
const router = express.Router();
const projectControl = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

// Public GET routes
router.get('/', projectControl.getAll);
router.get('/:id', projectControl.getSingle);

// Protected routes (Requires Login)
router.post('/', isAuthenticated, projectControl.createEntry);
router.put('/:id', isAuthenticated, projectControl.updateEntry);
router.delete('/:id', isAuthenticated, projectControl.deleteEntry);

module.exports = router;