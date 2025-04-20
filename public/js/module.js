document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) return;

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);

    const moduleId = getQueryParam('moduleId');
    if (!moduleId) {
        console.error('Module ID not found in URL');
        // Optionally redirect or show error message
        document.getElementById('module-content-area').innerHTML = '<p class="error-message">Module ID is missing.</p>';
        return;
    }

    loadModuleContent(moduleId);
});

async function loadModuleContent(moduleId) {
    const titleElement = document.getElementById('module-title');
    const contentDisplay = document.getElementById('module-content-display');
    const actionsSection = document.getElementById('module-actions');
    const takeQuizLink = document.getElementById('take-quiz-link');
    const quizStatus = document.getElementById('quiz-status');

    if (!titleElement || !contentDisplay || !actionsSection || !takeQuizLink || !quizStatus) {
        console.error('Required elements not found on module page.');
        return;
    }

    contentDisplay.innerHTML = '<p>Loading module content...</p>';
    titleElement.textContent = 'Loading Module...';
    actionsSection.style.display = 'none'; // Hide actions initially

    try {
        const module = await apiRequest(`/api/modules/${moduleId}`);

        titleElement.textContent = module.title || 'Module';
        
        // Display content based on type (Simplified)
        if (module.contentType === 'text') {
            contentDisplay.innerHTML = `<div class="text-content">${module.content || 'No content available.'}</div>`;
        } else if (module.contentType === 'pdf') {
            // Embedding PDFs can be tricky, might need a library or different approach
            contentDisplay.innerHTML = `<p>PDF Content for: ${module.title} (PDF viewer not implemented)</p><a href="${module.contentUrl}" target="_blank">Open PDF</a>`;
        } else if (module.contentType === 'video') {
            contentDisplay.innerHTML = `<video controls width="100%"><source src="${module.contentUrl}" type="video/mp4">Your browser does not support the video tag.</video>`;
        } else {
            contentDisplay.innerHTML = '<p>Unsupported content type.</p>';
        }

        // Show Quiz link (Assuming every module has a quiz for now)
        // TODO: Get actual quiz status for this module/user
        const quizId = module.id; // Assuming quizId maps directly to moduleId for simplicity
        takeQuizLink.href = `quiz.html?quizId=${quizId}`;
        takeQuizLink.style.display = 'inline-block';
        quizStatus.textContent = 'Quiz not taken yet.'; // Placeholder status
        actionsSection.style.display = 'block';
        

    } catch (error) {
        console.error('Failed to load module content:', error);
        titleElement.textContent = 'Error Loading Module';
        contentDisplay.innerHTML = '<p class="error-message">Could not load module content.</p>';
    }
} 