const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🌟 Welcome to Contacts API - CSE 341 Project',
    version: '2.0.0',
    author: 'BYU-I Student',
    description: 'A RESTful API for managing contacts',
    status: 'Online ✅',
    timestamp: new Date().toISOString(),
    documentation: '/api-docs',
    endpoints: {
      welcome: 'GET /',
      health: 'GET /health',
      swagger: 'GET /api-docs',
      getAllContacts: 'GET /contacts',
      getSingleContact: 'GET /contacts/:id',
      createContact: 'POST /contacts',
      updateContact: 'PUT /contacts/:id',
      deleteContact: 'DELETE /contacts/:id'
    },
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
      collection: 'contacts',
      sampleData: 'Seed with: npm run seed'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌';
  
  res.status(200).json({
    status: 'OK',
    service: 'Contacts API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// API Routes
app.use('/contacts', require('./routes/contacts'));

// Swagger setup - Check if swagger module exists, otherwise provide fallback
try {
  const swaggerDocs = require('./config/swagger');
  swaggerDocs(app);
} catch (error) {
  console.log('⚠️  Swagger module not found. Creating basic /api-docs route...');
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerUi = require('swagger-ui-express');
  
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Contacts API',
        version: '2.0.0',
        description: 'Contacts API for CSE 341 Week 02 Project'
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routes/*.js']
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📚 Basic Swagger Docs available at /api-docs');
}

// 404 Handler - Route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Check available routes at GET / or documentation at GET /api-docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Contacts API Server Started - Week 02 Complete');
  console.log('='.repeat(60));
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('📋 Available Endpoints:');
  console.log(`   Home:           http://localhost:${PORT}/`);
  console.log(`   Health:         http://localhost:${PORT}/health`);
  console.log(`   Swagger Docs:   http://localhost:${PORT}/api-docs`);
  console.log(`   All Contacts:   http://localhost:${PORT}/contacts`);
  console.log(`   Single Contact: http://localhost:${PORT}/contacts/{id}`);
  console.log(`   Create Contact: POST http://localhost:${PORT}/contacts`);
  console.log(`   Update Contact: PUT http://localhost:${PORT}/contacts/{id}`);
  console.log(`   Delete Contact: DELETE http://localhost:${PORT}/contacts/{id}`);
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});