const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API - CSE 341 Week 03',
      version: '1.0.0',
      description: 'A REST API for managing tasks and projects with full CRUD operations',
      contact: {
        name: 'BYU-I Student',
      },
    },
    servers: [
      {
        url: process.env.RENDER_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      {
        name: 'Projects',
        description: 'Project management operations',
      },
      {
        name: 'Tasks',
        description: 'Task management operations',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Project name',
              example: 'Website Redesign',
            },
            description: {
              type: 'string',
              description: 'Project description',
              example: 'Complete redesign of company website',
            },
            status: {
              type: 'string',
              enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
              example: 'active',
            },
            deadline: {
              type: 'string',
              format: 'date',
              example: '2024-12-31',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Create homepage layout',
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Design and implement homepage layout',
            },
            projectId: {
              type: 'string',
              description: 'ID of the project this task belongs to',
              example: '507f1f77bcf86cd799439011',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              example: 'high',
            },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'review', 'completed', 'blocked'],
              example: 'in-progress',
            },
            assignedTo: {
              type: 'string',
              example: 'John Doe',
            },
            estimatedHours: {
              type: 'number',
              example: 8,
            },
            dueDate: {
              type: 'string',
              format: 'date',
              example: '2024-06-15',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['frontend', 'design', 'urgent'],
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger docs available at ${process.env.RENDER_URL || 'http://localhost:3000'}/api-docs`);
};

module.exports = swaggerDocs;