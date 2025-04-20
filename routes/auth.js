const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// !!! In-memory store - NOT FOR PRODUCTION !!!
// Replace with database interaction later
const users = []; 
let userIdCounter = 1;

// --- Registration Route --- 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Create new user (In-memory)
        const newUser = {
            id: userIdCounter++,
            name,
            email,
            password: hashedPassword,
            role: 'employee' // Default role
        };
        users.push(newUser);
        console.log('User registered:', newUser); // Log registered user (remove sensitive data later)
        console.log('Current users:', users); // Log current users

        // Don't send token on register, just success message
        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// --- Login Route --- 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find user
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use generic message
        }

        // Generate JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name
            }
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
             console.error('JWT_SECRET is not defined in .env file!');
             return res.status(500).json({ message: 'Server configuration error.'});
        }

        jwt.sign(
            payload,
            secret,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: payload.user // Send user info back
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router; 