// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/auth');

router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/auth/success');
    }
);

router.get('/success', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            message: 'Authentication successful',
            user: {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.email,
                role: req.user.role
            }
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
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

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                displayName: req.user.displayName,
                email: req.user.email,
                role: req.user.role
            }
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
    }
});

// Optional local auth routes
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayName } = req.body;
        
        const existingUser = await require('../models/User').findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }
        
        const user = new (require('../models/User'))({
            email,
            password,
            displayName
        });
        
        await user.save();
        
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Auto-login failed'
                });
            }
            
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email
                }
            });
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Registration failed: ' + error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await require('../models/User').findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        user.lastLogin = new Date();
        await user.save();
        
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Login failed'
                });
            }
            
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email
                }
            });
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Login failed: ' + error.message
        });
    }
});

module.exports = router;