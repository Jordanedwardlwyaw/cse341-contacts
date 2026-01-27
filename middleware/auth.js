// middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
    });
};

const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({
        success: false,
        error: 'Admin privileges required'
    });
};

const getCurrentUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.currentUser = {
            id: req.user.id,
            displayName: req.user.displayName,
            email: req.user.email,
            role: req.user.role
        };
    }
    next();
};

const optionalAuth = (req, res, next) => {
    req.isAuth = req.isAuthenticated();
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    getCurrentUser,
    optionalAuth
};