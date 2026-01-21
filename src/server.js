const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerDocs = require('./config/swagger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Task Management API - CSE 341 Week 03',
    version: '1.0.0',
    description: 'API for managing tasks and projects',
    documentation: '/api-docs',
    endpoints: {
      projects: {
        getAll: 'GET /projects',
        getSingle: 'GET /projects/:id',
        create: 'POST /projects',
        update: 'PUT /projects/:id',
        delete: 'DELETE /projects/:id'
      },
      tasks: {
        getAll: 'GET /tasks',
        getSingle: 'GET /tasks/:id',
        create: 'POST /tasks',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id'
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Task Management API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/projects', require('./routes/projectRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));

// Swagger documentation
swaggerDocs(app);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Check available routes at GET /'
  });
});

// Error handling
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

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Task Management API Server Started');
  console.log('='.repeat(60));
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
  console.log('📋 Available Endpoints:');
  console.log(`   Home:     http://localhost:${PORT}/`);
  console.log(`   Health:   http://localhost:${PORT}/health`);
  console.log(`   Projects: http://localhost:${PORT}/projects`);
  console.log(`   Tasks:    http://localhost:${PORT}/tasks`);
  console.log(`   Docs:     http://localhost:${PORT}/api-docs`);
  console.log('='.repeat(60));
});