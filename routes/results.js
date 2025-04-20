const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { quizzes, resultsStore } = require('./quizzes'); // Import shared data

// GET /api/results/:resultId - Get results for a specific submission
router.get('/:resultId', authenticateToken, (req, res) => {
    const resultId = parseInt(req.params.resultId, 10);
    const userId = req.user.id;
    console.log(`API: Fetching result ${resultId} for user ${userId} via /results route`);

    const result = resultsStore.find(r => r.resultId === resultId);

    if (!result) {
        return res.status(404).json({ message: 'Result not found' });
    }
    // Ensure the logged-in user owns this result
    if (result.userId !== userId) {
         return res.status(403).json({ message: 'Forbidden: You cannot view this result.' });
    }

    // Add quiz title to the result for context
    const quiz = quizzes[result.quizId];
    const resultWithTitle = {
        ...result,
        quizTitle: quiz ? quiz.title : 'Unknown Quiz'
    };

    res.json(resultWithTitle);
});

module.exports = router; 