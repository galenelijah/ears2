document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) {
        return;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // TODO: Implement user role display if needed

    console.log('Progress page loaded');
    loadProgressDetails(); // Function to load detailed progress
});

async function loadProgressDetails() {
    const progressDetailsElement = document.getElementById('progress-details');
    if (!progressDetailsElement) return;
    progressDetailsElement.innerHTML = ''; // Clear loading

    try {
        // --- Reverted to Static Data --- 
        // const progressData = await apiRequest('/api/progress/detailed');
        const progressData = {
            completedModules: [
                { id: 3, title: 'Workplace Safety', completionDate: '2025-04-18' }
            ],
            assessmentScores: [
                 { id: 2, title: 'Customer Service Scenarios', score: 75, resultId: 1 },
                 { id: 3, title: 'Safety Procedures Test', score: 90, resultId: 2 },
            ],
            overallProgress: 33, // Example percentage
            averageScore: 82.5 // Example average
        };
        // --- End Static Data ---

        progressDetailsElement.innerHTML = ''; // Clear loading
        
        // Display Overall Summary
        const summaryDiv = document.createElement('div');
        summaryDiv.classList.add('progress-section');
        summaryDiv.innerHTML = `
            <h2>Overall Summary</h2>
            <div class="metrics-container">
                <div class="metric">
                    <span class="value">${progressData.overallProgress ?? 0}%</span>
                    <span class="label">Overall Progress</span>
                </div>
                 <div class="metric">
                    <span class="value">${progressData.averageScore ? progressData.averageScore.toFixed(1) + '%' : 'N/A'}</span>
                    <span class="label">Average Score</span>
                </div>
            </div>
            <hr>
        `;
        progressDetailsElement.appendChild(summaryDiv);

        // Display Completed Modules
        const completedDiv = document.createElement('div');
        completedDiv.classList.add('progress-section');
        completedDiv.innerHTML = '<h2>Completed Modules</h2>';
        if (progressData.completedModules && progressData.completedModules.length > 0) {
            const list = document.createElement('ul');
            list.className = 'progress-list';
            progressData.completedModules.forEach(m => {
                const item = document.createElement('li');
                item.innerHTML = `<strong>${m.title}</strong> (Completed: ${m.completionDate || 'Unknown'})`;
                list.appendChild(item);
            });
            completedDiv.appendChild(list);
        } else {
            completedDiv.innerHTML += '<p>No modules completed yet.</p>';
        }
         completedDiv.innerHTML += '<hr>';
        progressDetailsElement.appendChild(completedDiv);

        // Display Assessment Scores
        const scoresDiv = document.createElement('div');
        scoresDiv.classList.add('progress-section');
        scoresDiv.innerHTML = '<h2>Assessment Scores</h2>';
         if (progressData.assessmentScores && progressData.assessmentScores.length > 0) {
            const list = document.createElement('ul');
            list.className = 'progress-list';
            progressData.assessmentScores.forEach(a => {
                const item = document.createElement('li');
                const resultIdParam = a.resultId || a.id; // Use resultId if available
                item.innerHTML = `<a href="result.html?resultId=${resultIdParam}" class="progress-result-link"><strong>${a.title}</strong>: ${a.score}%</a>`; 
                list.appendChild(item);
            });
            scoresDiv.appendChild(list);
        } else {
            scoresDiv.innerHTML += '<p>No assessments taken yet.</p>';
        }
        progressDetailsElement.appendChild(scoresDiv);

        // TODO: Add charts or more visual representations if desired
        // Example: Could use a library like Chart.js

    } catch (error) {
        console.error('Error processing static progress details:', error);
        progressDetailsElement.innerHTML = '<p class="error-message">Could not display progress details.</p>';
    }
}

// Add relevant CSS for .progress-section, .metrics-container, .progress-list, .progress-result-link if needed 