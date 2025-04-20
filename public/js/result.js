document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) return;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);

    const resultId = getQueryParam('resultId');
    if (!resultId) {
        console.error('Result ID not found in URL');
        document.querySelector('.result-container').innerHTML = '<p class="error-message">Result ID is missing.</p>';
        return;
    }

    loadResultDetails(resultId);
});

async function loadResultDetails(resultId) {
    const quizTitleEl = document.getElementById('result-quiz-title');
    const scoreEl = document.getElementById('result-score');
    const statusEl = document.getElementById('result-status');
    const correctEl = document.getElementById('result-correct');
    const totalEl = document.getElementById('result-total');

    if (!quizTitleEl || !scoreEl || !statusEl || !correctEl || !totalEl) {
        console.error('Required elements not found on result page.');
        return;
    }

    try {
        const resultData = await apiRequest(`/api/results/${resultId}`);
        
        quizTitleEl.textContent = resultData.quizTitle || 'Quiz Result';
        scoreEl.textContent = `${resultData.score}%`;
        correctEl.textContent = resultData.correctCount;
        totalEl.textContent = resultData.totalQuestions;

        // Determine pass/fail status (Example: >= 80% is pass)
        const passMark = 80;
        if (resultData.score >= passMark) {
            statusEl.textContent = 'Passed';
            statusEl.style.color = 'green'; // Optional styling
        } else {
            statusEl.textContent = 'Failed';
            statusEl.style.color = 'red'; // Optional styling
        }

    } catch (error) {
        console.error('Failed to load result details:', error);
         document.querySelector('.result-container').innerHTML = '<p class="error-message">Could not load quiz results.</p>';
    }
} 