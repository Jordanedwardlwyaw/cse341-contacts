const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const connectDB = require('./data/database'); // Matches your Mongoose file
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
app.use(bodyParser.json());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'cse341-secret-key',
  resave: false,
  saveUninitialized: true, 
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ========== PASSPORT CONFIGURATION ==========
const getCallbackURL = () => {
  if (process.env.GITHUB_CALLBACK_URL) return process.env.GITHUB_CALLBACK_URL;
  if (process.env.NODE_ENV === 'production') return 'https://cse340-two.onrender.com/auth/github/callback';
  return `http://localhost:${port}/auth/github/callback`;
};

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: getCallbackURL()
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ========== ROUTES ==========
app.use('/', require('./routes/index.js'));

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send(`
    <h1>Internal Server Error</h1>
    <p style="color:red;">${err.message}</p>
    <a href="/">Go back to Home</a>
  `);
});

// ========== START SERVER ==========
// Changed to call your Mongoose connectDB function
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🔐 Using GitHub Callback: ${getCallbackURL()}`);
  });
});