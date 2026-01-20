const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API - CSE 341 Week 02 Project',
      version: '2.0.0',
      description: 'A RESTful API for managing contacts with full CRUD operations',
      contact: {
        name: 'BYU-I Student',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Contacts',
        description: 'Contact management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to your routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📚 Swagger documentation available at http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = swaggerDocs;