const isAuthenticated = (req, res, next) => {
    // Passport adds the isAuthenticated() method to the request object automatically
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: 'Authentication required',
            message: 'You do not have access. Please log in via GitHub.'
        });
    }
    // If authenticated, proceed to the controller
    next();
};

module.exports = {
    isAuthenticated
};