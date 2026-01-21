require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./src/models/project');
const Task = require('./src/models/task');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create sample projects
    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'active',
      deadline: '2024-12-31'
    });

    const project2 = new Project({
      name: 'Mobile App Development',
      description: 'Build new mobile application',
      status: 'planning'
    });

    const projects = await Project.insertMany([project1, project2]);
    console.log(`Created ${projects.length} projects`);

    // Create sample tasks
    const tasks = [
      {
        title: 'Create homepage layout',
        description: 'Design and implement homepage layout',
        projectId: projects[0]._id,
        priority: 'high',
        status: 'in-progress',
        assignedTo: 'John Doe',
        estimatedHours: 8,
        dueDate: '2024-06-15',
        tags: ['frontend', 'design', 'urgent']
      },
      {
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        projectId: projects[0]._id,
        priority: 'critical',
        status: 'todo',
        estimatedHours: 16,
        dueDate: '2024-06-30',
        tags: ['backend', 'security']
      },
      {
        title: 'Market research',
        description: 'Research competitors and market trends',
        projectId: projects[1]._id,
        priority: 'medium',
        status: 'completed',
        assignedTo: 'Jane Smith',
        estimatedHours: 20,
        actualHours: 18,
        tags: ['research', 'planning']
      },
      {
        title: 'Design wireframes',
        description: 'Create initial wireframes for mobile app',
        projectId: projects[1]._id,
        priority: 'high',
        status: 'in-progress',
        estimatedHours: 12,
        dueDate: '2024-07-10',
        tags: ['design', 'ui/ux']
      }
    ];

    const createdTasks = await Task.insertMany(tasks);
    console.log(`Created ${createdTasks.length} tasks`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample data created:');
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Tasks: ${createdTasks.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();