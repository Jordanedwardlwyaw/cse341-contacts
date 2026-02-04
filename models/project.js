const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Project name is required'] 
    },
    description: { type: String },
    status: { 
        type: String, 
        required: true,
        default: 'planning'
    },
    priority: { type: String },
    category: { type: String },
    deadline: { type: Date },
    assignedTo: { type: String }
}, { 
    versionKey: false,
    collection: 'projects' 
});

module.exports = mongoose.model('Project', projectSchema);