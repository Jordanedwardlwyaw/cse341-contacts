const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Final Project API',
    description: 'Projects and Contacts API Documentation',
  },
  host: 'localhost:3000', 
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);