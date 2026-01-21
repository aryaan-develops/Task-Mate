
module.exports = function (req, res, next) {
    // Requires auth middleware to run first to set req.user
    if (req.user && req.user.role === 'admin') {
        console.log('Admin Middleware: Access granted to', req.user.email);
        next();
    } else {
        console.log('Admin Middleware: Access DENIED. User role:', req.user ? req.user.role : 'No user');
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};
