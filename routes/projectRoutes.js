const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { isAuthenticated } = require('../middleware/auth');

// Public route
router.get('/', projectController.getAllProjects);

// Protected route (Week 4 Requirement)
router.post('/', isAuthenticated, projectController.createProject);

module.exports = router;