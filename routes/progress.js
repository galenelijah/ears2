const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Placeholder data access (would query DB or other services)
const { quizzes, resultsStore } = require('./quizzes'); // Import shared data from quizzes export
const { allModules, userAssignments } = require('./modules'); // Import shared in-memory data


// Helper function to calculate progress (very basic)
function calculateUserProgress(userId) {
    // TODO: Replace with actual data fetching and logic
    const assigned = userAssignments[userId] || [];
    const completedCount = resultsStore.filter(r => r.userId === userId && r.score >= 80).length; // Example: pass >= 80%
    const totalAssigned = assigned.length;
    const overallProgress = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

    const userResults = resultsStore.filter(r => r.userId === userId);
    let averageScore = null;
    if (userResults.length > 0) {
        const sum = userResults.reduce((acc, r) => acc + r.score, 0);
        averageScore = sum / userResults.length;
    }
    
    const completedModules = resultsStore
        .filter(r => r.userId === userId && r.score >= 80) // Example pass mark
        .map(r => {
            const module = allModules.find(m => m.id === quizzes[r.quizId]?.moduleId);
            return {
                id: module?.id,
                title: module?.title || 'Unknown Module',
                completionDate: r.submittedAt.toISOString().split('T')[0] // Format date
            };
        }).filter(m => m.id);

    const assessmentScores = userResults.map(r => ({
        id: r.quizId,
        title: quizzes[r.quizId]?.title || 'Unknown Quiz',
        score: r.score
    }));

    return {
        modulesCompleted: completedCount,
        averageScore,
        overallProgress,
        completedModules,
        assessmentScores
    };
}


// --- Routes ---

// GET /api/progress/summary - Get dashboard summary
router.get('/summary', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log(`API: Fetching progress summary for user ${userId}`);
    const progress = calculateUserProgress(userId);
    res.json({
        modulesCompleted: progress.modulesCompleted,
        averageScore: progress.averageScore
    });
});

// GET /api/progress/detailed - Get detailed progress data
router.get('/detailed', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log(`API: Fetching detailed progress for user ${userId}`);
    const progress = calculateUserProgress(userId);
     res.json({
        overallProgress: progress.overallProgress,
        averageScore: progress.averageScore,
        completedModules: progress.completedModules,
        assessmentScores: progress.assessmentScores
    });
});

module.exports = router; 