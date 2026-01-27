// server.js - COMPLETE AND WORKING VERSION
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== DATABASE CONNECTION ==========
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected to project2-db'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});

// ========== MIDDLEWARE ==========
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== SESSION CONFIGURATION ==========
// Using memory store (works without connect-mongo)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // false for localhost
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// ========== PASSPORT CONFIGURATION ==========
app.use(passport.initialize());
app.use(passport.session());

// Simple user serialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// ========== AUTHENTICATION MIDDLEWARE ==========
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
    });
};

// ========== ROUTES ==========

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Bookstore API - Project 2 Week 4',
        version: '2.0.0',
        authenticated: req.isAuthenticated() ? true : false,
        user: req.isAuthenticated() ? req.user : null,
        endpoints: {
            auth: {
                test_login: '/auth/test-login (for testing)',
                logout: '/auth/logout',
                current: '/auth/current'
            },
            books: {
                get_all: 'GET /api/books',
                create: 'POST /api/books (requires auth)',
                get_one: 'GET /api/books/:id',
                update: 'PUT /api/books/:id (requires auth)',
                delete: 'DELETE /api/books/:id (requires auth)'
            },
            health: '/health'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// ========== AUTHENTICATION ROUTES ==========

// Test login (for development without Google OAuth)
app.get('/auth/test-login', (req, res) => {
    req.login({
        id: 'test-user-' + Date.now(),
        displayName: 'Test User',
        email: 'test@example.com',
        role: 'user'
    }, (err) => {
        if (err) {
            return res.status(500).json({ 
                success: false,
                error: 'Login failed' 
            });
        }
        res.json({
            success: true,
            message: 'Test login successful. You are now authenticated.',
            user: req.user
        });
    });
});

// Get current user
app.get('/auth/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            authenticated: true,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            authenticated: false,
            error: 'Not authenticated'
        });
    }
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// ========== BOOK MODEL & ROUTES ==========

// Book Schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    isbn: {
        type: String,
        required: [true, 'ISBN is required'],
        unique: true
    },
    publicationYear: {
        type: Number,
        required: [true, 'Publication year is required'],
        min: [1000, 'Year must be after 1000'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Biography', 'History', 'Other']
    },
    pages: {
        type: Number,
        required: [true, 'Number of pages is required'],
        min: [1, 'Book must have at least 1 page']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    createdBy: {
        type: String,
        default: 'anonymous'
    }
}, { 
    timestamps: true 
});

const Book = mongoose.model('Book', bookSchema);

// GET all books (Public)
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching books: ' + error.message
        });
    }
});

// GET single book (Public)
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Invalid book ID'
        });
    }
});

// POST create book (Protected - requires authentication)
app.post('/api/books', isAuthenticated, async (req, res) => {
    try {
        const bookData = {
            ...req.body,
            createdBy: req.user.id || 'authenticated-user'
        };
        
        const book = await Book.create(bookData);
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: book
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A book with this ISBN already exists'
            });
        }
        res.status(400).json({
            success: false,
            error: 'Error creating book: ' + error.message
        });
    }
});

// PUT update book (Protected - requires authentication)
app.put('/api/books/:id', isAuthenticated, async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A book with this ISBN already exists'
            });
        }
        res.status(400).json({
            success: false,
            error: 'Error updating book: ' + error.message
        });
    }
});

// DELETE book (Protected - requires authentication)
app.delete('/api/books/:id', isAuthenticated, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error deleting book: ' + error.message
        });
    }
});

// ========== ERROR HANDLERS ==========
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`
==========================================
🚀  Server running on port ${PORT}
==========================================
🔗  Local: http://localhost:${PORT}
📊  Health: http://localhost:${PORT}/health

📚  API ENDPOINTS:
├── GET  /                    - Welcome page
├── GET  /health              - Health check
├── GET  /auth/test-login     - Test login (no Google needed)
├── GET  /auth/current        - Check auth status
├── GET  /auth/logout         - Logout
├── GET  /api/books           - Get all books (PUBLIC)
├── GET  /api/books/:id       - Get single book (PUBLIC)
├── POST /api/books           - Create book (PROTECTED)
├── PUT  /api/books/:id       - Update book (PROTECTED)
└── DELETE /api/books/:id     - Delete book (PROTECTED)

🔐  TESTING INSTRUCTIONS:
1. First visit /auth/test-login to authenticate
2. Try POST /api/books (should work when authenticated)
3. Try without authentication (should fail with 401)
4. Check /auth/current to see your auth status
==========================================
    `);
});