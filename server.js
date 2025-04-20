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

// --- API Routes (Mount BEFORE Static) ---
const apiRouter = express.Router();

// Import specific route handlers
const authRoutes = require('./routes/auth');
const moduleRoutes = require('./routes/modules');
// Import router and data from quizzes.js
const { quizRouter } = require('./routes/quizzes'); 
const resultsRoutes = require('./routes/results'); // Import the new results router
const progressRoutes = require('./routes/progress');

// Mount specific routers onto the main API router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/modules', moduleRoutes);
apiRouter.use('/quizzes', quizRouter); // Use the exported quizRouter
apiRouter.use('/progress', progressRoutes);
// Use the dedicated results router for the /results path
apiRouter.use('/results', resultsRoutes); 

// Mount the main API router to the app
app.use('/api', apiRouter);

// --- Serve Static Files (Mount AFTER API) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Catch-all for SPA (Important: Keep AFTER API routes and static files) ---
// Simplify or comment out temporarily to isolate the issue
// app.get(['/employee/*', '/admin/*'], (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html')); 
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