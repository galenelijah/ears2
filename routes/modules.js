const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// --- Placeholder Data (Replace with DB later) ---
const allModules = [
    { id: 1, title: 'POS Basics Training', description: 'Learn the point-of-sale system.', content: 'Module 1 content...', contentType: 'text' },
    { id: 2, title: 'Customer Service Essentials', description: 'Essential skills for customer interaction.', content: 'Module 2 content...', contentType: 'text' },
    { id: 3, title: 'Workplace Safety', description: 'Mandatory safety procedures.', content: 'Module 3 content...', contentType: 'text' },
    { id: 4, title: 'Advanced Sales Techniques', description: 'Improve your sales performance.', content: 'Module 4 content...', contentType: 'text' },
    { id: 5, title: 'Product Knowledge Course', description: 'Deep dive into our product catalog.', content: 'Module 5 content...', contentType: 'text' },
];

// Placeholder for user assignments (Replace with DB later)
const userAssignments = {
    // Assuming user ID 1 is created from first registration
    1: [1, 2, 3], // User 1 assigned modules 1, 2, 3
    // Add more assignments as needed
};

// --- Routes (Reordered) ---

// GET /api/modules/:id - Get details for a specific module (for Module Viewer page)
router.get('/:id', authenticateToken, (req, res) => {
    const moduleId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    console.log(`API: Fetching module ${moduleId} for user ${userId}`);

    // TODO: Check if user is assigned/allowed to view this module
    const assignedIds = userAssignments[userId] || [];
    if (!assignedIds.includes(moduleId)) {
         // Commenting out for easier testing without full assignment logic
        // return res.status(403).json({ message: 'Forbidden: Module not assigned.' });
    }

    const module = allModules.find(m => m.id === moduleId);
    if (module) {
        res.json(module); // Send full module details including content
    } else {
        res.status(404).json({ message: 'Module not found' });
    }
});

// GET /api/modules - Get all available modules (for Training Modules page)
router.get('/', authenticateToken, (req, res) => {
    console.log('API: Fetching all modules');
    // In a real app, you might filter based on user permissions or catalog
    const modulesForUser = allModules.map(({ content, ...rest }) => rest); // Exclude content from list view
    res.json(modulesForUser);
});

// GET /api/modules/assigned - Get modules assigned to the logged-in user (for Dashboard)
router.get('/assigned', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log(`API: Fetching assigned modules for user ${userId}`);
    const assignedIds = userAssignments[userId] || [];
    const assignedModules = allModules
        .filter(m => assignedIds.includes(m.id))
        .map(({ content, ...rest }) => ({ // Exclude content, add status/progress (placeholder)
            ...rest,
            status: 'Not Started', // TODO: Fetch actual status from DB
            progress: 0          // TODO: Fetch actual progress from DB
        })); 
    res.json(assignedModules);
});

module.exports = router; 