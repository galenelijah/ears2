const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        console.log('Auth Error: No token provided');
        return res.sendStatus(401); // if there isn't any token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
        if (err) {
            console.log('Auth Error:', err.message);
            return res.sendStatus(403); // Token is no longer valid
        }
        req.user = userPayload.user; // Add user payload to request object
        // console.log('Authenticated user:', req.user); // Optional: Log authenticated user
        next(); // pass the execution off to whatever request the client intended
    });
}

// Middleware to check for a specific role (e.g., 'admin')
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            console.log(`Authorization Error: User ${req.user?.id} with role ${req.user?.role} attempted to access ${role} route.`);
            res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
    };
}

module.exports = {
    authenticateToken,
    authorizeRole
}; 