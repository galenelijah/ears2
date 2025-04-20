const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// --- Placeholder Data (Export for sharing) ---
const quizzes = {
    1: { // Corresponds to moduleId 1
        id: 1,
        moduleId: 1,
        title: 'POS Basics Quiz',
        questions: [
            { id: 101, text: 'What does POS stand for?', options: ['Point of Sale', 'Piece of Software', 'Payment Operating System'], correctAnswer: 'Point of Sale' },
            { id: 102, text: 'What is the main function of a barcode scanner?', options: ['Weigh items', 'Read product codes', 'Print receipts'], correctAnswer: 'Read product codes' }
        ]
    },
    2: { // Corresponds to moduleId 2
        id: 2,
        moduleId: 2,
        title: 'Customer Service Scenarios',
        questions: [
            { id: 201, text: 'A customer is angry about a faulty product. What should you do first?', options: ['Apologize and offer a refund', 'Listen to their complaint patiently', 'Explain the return policy'], correctAnswer: 'Listen to their complaint patiently' },
            { id: 202, text: 'What is a key element of good communication?', options: ['Speaking loudly', 'Using jargon', 'Active listening'], correctAnswer: 'Active listening' }
        ]
    },
     3: { // Corresponds to moduleId 3
        id: 3,
        moduleId: 3,
        title: 'Safety Procedures Test',
        questions: [
            { id: 301, text: 'Where is the nearest fire extinguisher?', options: ['By the front door', 'In the break room', 'Next to the main exit'], correctAnswer: 'Next to the main exit' }, // Example answers
            { id: 302, text: 'What should you do in case of a fire alarm?', options: ['Finish your work', 'Evacuate immediately via the nearest exit', 'Call security'], correctAnswer: 'Evacuate immediately via the nearest exit' }
        ]
    },
    // Add quizzes for other modules if needed
};

// In-memory store for results (Replace with DB)
const resultsStore = [];
let resultIdCounter = 1;

// --- Main Quiz Router ---

// GET /api/quizzes/assessments - Get list of assessment statuses for the user
router.get('/assessments', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log(`API: Fetching assessment status for user ${userId}`);
    
    // TODO: Get actual assigned modules for user
    const assignedModuleIds = [1, 2, 3]; // Example
    const userResults = resultsStore.filter(r => r.userId === userId);

    const assessmentStatuses = assignedModuleIds.map(moduleId => {
        const quiz = Object.values(quizzes).find(q => q.moduleId === moduleId);
        if (!quiz) return null;
        const result = userResults.find(r => r.quizId === quiz.id);
        // Include resultId if available
        return { id: quiz.id, moduleId: quiz.moduleId, title: quiz.title, status: result ? 'Taken' : 'Not Taken', score: result ? result.score : null, resultId: result ? result.resultId : null };
    }).filter(Boolean);

    res.json(assessmentStatuses);
});

// GET /api/quizzes/:id - Get questions for a specific quiz
router.get('/:id', authenticateToken, (req, res) => {
    const quizId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    console.log(`API: Fetching quiz ${quizId} for user ${userId}`);

    const quiz = quizzes[quizId];
    if (quiz) {
        const questionsForUser = quiz.questions.map(({ correctAnswer, ...q }) => q);
        res.json({ id: quiz.id, title: quiz.title, questions: questionsForUser });
    } else {
        res.status(404).json({ message: 'Quiz not found' });
    }
});

// POST /api/quizzes/submit/:id - Submit quiz answers
router.post('/submit/:id', authenticateToken, (req, res) => {
    const quizId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const answers = req.body.answers;
    console.log(`API: Submitting quiz ${quizId} for user ${userId}`);

    const quiz = quizzes[quizId];
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (!answers || typeof answers !== 'object') return res.status(400).json({ message: 'Invalid answers format.' });

    let correctCount = 0;
    quiz.questions.forEach(q => {
        if (answers[q.id] && answers[q.id] === q.correctAnswer) correctCount++;
    });
    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const newResult = {
        resultId: resultIdCounter++, quizId, userId, score, correctCount, totalQuestions, submittedAt: new Date()
    };
    const existingResultIndex = resultsStore.findIndex(r => r.userId === userId && r.quizId === quizId);
    if (existingResultIndex > -1) resultsStore[existingResultIndex] = newResult;
    else resultsStore.push(newResult);
    console.log('Result stored:', newResult);

    res.status(201).json({ 
        message: 'Quiz submitted successfully!', 
        resultId: newResult.resultId,
        score: newResult.score 
    });
});

// Export the router AND the shared data
module.exports = {
    quizRouter: router, // Export the router under a specific name
    quizzes, 
    resultsStore
}; 