document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) {
        return;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // TODO: Implement user role display if needed

    console.log('Assessments page loaded');
    loadAssessments(); // Function to load assessment list
});

async function loadAssessments() {
    const assessmentListElement = document.getElementById('assessment-list');
    if (!assessmentListElement) return;
    assessmentListElement.innerHTML = ''; // Clear loading

    try {
        // --- Reverted to Static Data --- 
        // const assessments = await apiRequest('/api/quizzes/assessments'); 
        const assessments = [
            { id: 1, title: 'POS Basics Quiz', moduleId: 1, status: 'Not Taken', score: null, resultId: null },
            { id: 2, title: 'Customer Service Scenarios', moduleId: 2, status: 'Taken', score: 75, resultId: 1 }, // Example resultId
            { id: 3, title: 'Safety Procedures Test', moduleId: 3, status: 'Taken', score: 90, resultId: 2 }, // Example resultId
        ];
        // --- End Static Data ---

        if (assessments && assessments.length > 0) {
            assessmentListElement.innerHTML = ''; // Clear loading
            assessmentListElement.className = 'assessment-list-container'; 

            assessments.forEach(assessment => {
                const item = document.createElement('div');
                item.className = 'assessment-item card-style'; 
                let actionButton = '';
                if (assessment.status === 'Not Taken') {
                    actionButton = `<a href="quiz.html?quizId=${assessment.id}" class="button take-quiz-btn">Take Quiz</a>`;
                } else {
                     const resultIdParam = assessment.resultId || assessment.id; 
                     actionButton = `<a href="result.html?resultId=${resultIdParam}" class="button view-result-btn">View Result</a>`; 
                }
                item.innerHTML = `
                    <h3>${assessment.title}</h3>
                    <p>Status: ${assessment.status}</p>
                    <p>Score: ${assessment.score !== null ? assessment.score + '%' : '-'}</p>
                    <div class="assessment-actions">
                       ${actionButton}
                    </div>
                `;
                assessmentListElement.appendChild(item);
            });
        } else {
            assessmentListElement.innerHTML = '<p>No assessments available.</p>';
        }
    } catch (error) {
        console.error('Error processing static assessments:', error);
        assessmentListElement.innerHTML = '<p class="error-message">Could not display assessments.</p>';
    }
}

// Optional: Add CSS for .assessment-list-container if using a different layout
// Optional: Add specific styles for .take-quiz-btn, .view-result-btn

// Add CSS for .assessment-item, .card-style, .assessment-actions, .view-result-btn if needed 