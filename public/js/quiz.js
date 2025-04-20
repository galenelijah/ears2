document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) return;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);

    const quizId = getQueryParam('quizId');
    if (!quizId) {
        console.error('Quiz ID not found in URL');
        document.getElementById('quiz-questions-area').innerHTML = '<p class="error-message">Quiz ID is missing.</p>';
        return;
    }

    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', (event) => handleQuizSubmit(event, quizId));
    }

    loadQuizQuestions(quizId);
});

async function loadQuizQuestions(quizId) {
    const titleElement = document.getElementById('quiz-title');
    const questionsArea = document.getElementById('quiz-questions-area');
    const submitButton = document.getElementById('submit-quiz-button');

    if (!titleElement || !questionsArea || !submitButton) {
        console.error('Required elements not found on quiz page.');
        return;
    }

    questionsArea.innerHTML = '<p>Loading questions...</p>';
    titleElement.textContent = 'Loading Quiz...';
    submitButton.disabled = true;

    try {
        const quizData = await apiRequest(`/api/quizzes/${quizId}`);
        
        titleElement.textContent = quizData.title || 'Quiz';
        questionsArea.innerHTML = ''; // Clear loading message

        if (quizData.questions && quizData.questions.length > 0) {
            quizData.questions.forEach((question, index) => {
                const questionBlock = document.createElement('div');
                questionBlock.className = 'question-block';
                
                let optionsHtml = '';
                question.options.forEach((option, optionIndex) => {
                    optionsHtml += `
                        <label>
                            <input type="radio" name="question_${question.id}" value="${option}" required>
                            ${option}
                        </label>
                    `;
                });

                questionBlock.innerHTML = `
                    <p class="question-text">${index + 1}. ${question.text}</p>
                    <div class="options">
                        ${optionsHtml}
                    </div>
                `;
                questionsArea.appendChild(questionBlock);
            });
            submitButton.disabled = false; // Enable submit button only if questions load
        } else {
            questionsArea.innerHTML = '<p>No questions found for this quiz.</p>';
        }

    } catch (error) {
        console.error('Failed to load quiz questions:', error);
        titleElement.textContent = 'Error Loading Quiz';
        questionsArea.innerHTML = '<p class="error-message">Could not load quiz questions.</p>';
    }
}

async function handleQuizSubmit(event, quizId) {
    event.preventDefault();
    hideMessage('quiz-error'); // Use api.js helper
    const submitButton = document.getElementById('submit-quiz-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(event.target);
    const answers = {};
    // Extract answers from form data (key format: question_QUESTIONID)
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('question_')) {
            const questionId = key.split('_')[1];
            answers[questionId] = value;
        }
    }

    try {
        const result = await apiRequest(`/api/quizzes/submit/${quizId}`, 'POST', { answers });
        console.log('Quiz submission result:', result);
        
        // Redirect to result page using the resultId from the API response
        if (result && result.resultId) {
            window.location.href = `result.html?resultId=${result.resultId}`;
        } else {
            // Fallback or show message if resultId isn't returned
            showMessage('quiz-error', 'Quiz submitted, but could not redirect to results.', false);
            submitButton.textContent = 'Submitted'; // Indicate success even without redirect
        } 

    } catch (error) {
        console.error('Quiz submission failed:', error);
        showMessage('quiz-error', `Submission failed: ${error.message}`, true);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Quiz';
    }
} 