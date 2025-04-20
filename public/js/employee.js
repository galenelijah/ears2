document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    if (!checkAuth('employee')) { // Ensure only employees access this page
        // checkAuth function already handles redirection if needed
        return; // Stop script execution if auth fails
    }

    // Setup Logout Button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Display User Info (Example - user name stored during login)
    const userRoleElement = document.getElementById('user-role'); // Update if ID changed
    const storedRole = localStorage.getItem('userRole');
    if (userRoleElement && storedRole) {
        // Capitalize first letter
        userRoleElement.textContent = storedRole.charAt(0).toUpperCase() + storedRole.slice(1);
    }

    // --- Placeholder Functions for Loading Data ---
    loadAssignedModules();
    loadPerformanceSummary();
    
});

// Placeholder: Function to load assigned modules
async function loadAssignedModules() {
    const moduleOverview = document.querySelector('.module-overview');
    if (!moduleOverview) return;

    // Clear existing example content (or loading message)
    moduleOverview.innerHTML = '<p>Loading your modules...</p>';

    try {
        // --- TODO: Replace with actual API call --- 
        // const modules = await apiRequest('/api/employee/modules'); // Example endpoint
        
        // --- Example Static Data --- 
        const modules = [
            { id: 1, title: 'POS Basics Training', status: 'Not Started', progress: 0 },
            { id: 2, title: 'Customer Service Essentials', status: 'In Progress', progress: 50 },
            { id: 3, title: 'Workplace Safety', status: 'Completed', progress: 100 },
        ];
        // --- End Example Data ---

        if (modules && modules.length > 0) {
            moduleOverview.innerHTML = ''; // Clear loading message
            modules.forEach(module => {
                const card = document.createElement('div');
                card.className = 'module-card';
                if (module.status === 'Completed') {
                    card.classList.add('completed');
                }
                
                // Determine progress text
                let progressText = `${module.progress}% Complete`;
                if (module.status === 'Not Started') progressText = 'Not Started';
                else if (module.status === 'Completed') progressText = 'Completed';

                card.innerHTML = `
                    <h3>${module.title}</h3>
                    <p>${progressText}</p>
                    <a href="module.html?moduleId=${module.id}" class="button play-button">${module.status === 'Completed' ? 'View' : '▶'}</a> 
                `;
                moduleOverview.appendChild(card);
            });
        } else {
            moduleOverview.innerHTML = '<p>No modules assigned yet.</p>';
        }
    } catch (error) {
        console.error('Failed to load modules:', error);
        moduleOverview.innerHTML = '<p class="error-message">Could not load modules. Please try again later.</p>';
        // Optionally use showMessage from api.js if the element exists
    }
}

// Placeholder: Function to load performance summary
async function loadPerformanceSummary() {
    const modulesCompletedEl = document.getElementById('modules-completed');
    const averageScoreEl = document.getElementById('average-score');

    if (!modulesCompletedEl || !averageScoreEl) return;

    try {
         // --- TODO: Replace with actual API call --- 
        // const summary = await apiRequest('/api/employee/performance'); // Example endpoint

        // --- Example Static Data ---
        const summary = {
            modulesCompleted: 1, // Example value
            averageScore: 85.5 // Example value (or null if none completed)
        };
        // --- End Example Data ---

        modulesCompletedEl.textContent = summary.modulesCompleted;
        averageScoreEl.textContent = summary.averageScore !== null ? `${summary.averageScore.toFixed(1)}%` : 'N/A';

    } catch (error) {
        console.error('Failed to load performance summary:', error);
        modulesCompletedEl.textContent = '-';
        averageScoreEl.textContent = '-';
         // Optionally show an error message
    }
}

// Make sure checkAuth and logout are accessible (assuming api.js is loaded first)
// If api.js functions aren't global, you might need adjustments. 