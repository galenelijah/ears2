require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for all origins
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// --- Serve Static Files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Basic Route for Testing ---
app.get('/', (req, res) => {
    res.send('EARS Backend is running!');
});

// --- Placeholder for API Routes ---
const authRoutes = require('./routes/auth'); // Import auth routes
app.use('/api/auth', authRoutes);
// Example: app.use('/api/modules', require('./routes/modules'));

// --- Catch-all for SPA (Optional - if using frontend routing) ---
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// --- Error Handling Middleware (Basic Example) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 