const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    priority: { type: String },
    category: { type: String },
    deadline: { type: Date },
    assignedTo: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);