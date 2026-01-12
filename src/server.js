const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
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
    version: '1.0.0',
    author: 'BYU-I Student',
    description: 'A RESTful API for managing contacts',
    status: 'Online ✅',
    timestamp: new Date().toISOString(),
    documentation: 'Week 02: Swagger documentation will be added',
    endpoints: {
      welcome: 'GET /',
      health: 'GET /health',
      getAllContacts: 'GET /contacts',
      getSingleContact: 'GET /contacts/:id',
      week1: 'GET, POST, PUT, DELETE endpoints coming in Week 02'
    },
    database: {
      status: 'Connected to MongoDB',
      collection: 'contacts',
      sampleData: '5 contacts pre-loaded'
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
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/contacts', require('./routes/contacts'));

// 404 Handler - Route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Available routes: GET /, GET /health, GET /contacts, GET /contacts/:id'
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
  console.log('🚀 Contacts API Server Started');
  console.log('='.repeat(60));
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('📋 Available Endpoints:');
  console.log(`   Home:      http://localhost:${PORT}/`);
  console.log(`   Health:    http://localhost:${PORT}/health`);
  console.log(`   All Contacts: http://localhost:${PORT}/contacts`);
  console.log(`   Single Contact: http://localhost:${PORT}/contacts/{id}`);
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