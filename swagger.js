const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Projects and Contacts API',
    description: 'CSE 341 Project 2',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);