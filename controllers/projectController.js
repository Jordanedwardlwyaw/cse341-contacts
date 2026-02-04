const Project = require('../models/project');

// Get all projects
const getAll = async (req, res) => {
    try {
        const results = await Project.find();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving projects: ' + error.message });
    }
};

// Get single project by ID
const getSingle = async (req, res) => {
    try {
        const entry = await Project.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Invalid ID format or server error' });
    }
};

// Create new project
const createEntry = async (req, res) => {
    try {
        const project = new Project(req.body);
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: 'Validation failed: ' + error.message });
    }
};

// Update project
const updateEntry = async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Update failed: ' + error.message });
    }
};

// Delete project
const deleteEntry = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete error: ' + error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createEntry,
    updateEntry,
    deleteEntry
};