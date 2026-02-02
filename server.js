require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== PASSPORT CONFIGURATION ==========
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ========== MIDDLEWARE ==========
app.use(express.json());
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'cse341-project-secret', 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// ========== ROUTES ==========
// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Collection Routes
app.use('/contacts', require('./routes/contactRoutes')); // Week 1-2 Logic
app.use('/projects', require('./routes/projectRoutes')); // Week 3-4 Logic

// Auth Logic
app.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    res.send(`
        <h1>CSE 341: Project 2 (Week 1-4)</h1>
        <p>Logged in as: ${req.user ? req.user.displayName : 'Guest'}</p>
        <ul>
            <li><a href="/api-docs">API Documentation (Swagger)</a></li>
            <li><a href="/contacts">View Contacts</a></li>
            <li><a href="/projects">View Projects</a></li>
            <li>${req.user ? '<a href="/logout">Logout</a>' : '<a href="/login">Login with Google</a>'}</li>
        </ul>
    `);
});

// ========== START SERVER ==========
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n==========================================`);
            console.log(`🚀  SERVER RUNNING ON PORT: ${PORT}`);
            console.log(`==========================================`);
            console.log(`✅  MongoDB Connected Successfully`);
            console.log(`\n📂  TESTING LINKS:`);
            console.log(`🏠  Home:      http://localhost:${PORT}/`);
            console.log(`📖  Docs:      http://localhost:${PORT}/api-docs`);
            console.log(`👥  Contacts:  http://localhost:${PORT}/contacts`);
            console.log(`📂  Projects:  http://localhost:${PORT}/projects`);
            console.log(`🔐  Login:     http://localhost:${PORT}/login`);
            console.log(`==========================================\n`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });