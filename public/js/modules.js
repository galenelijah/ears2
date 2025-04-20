document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) {
        return;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // TODO: Implement user role display if needed

    console.log('Modules page loaded');
    loadAllModules(); // Function to load module list
});

async function loadAllModules() {
    const moduleListElement = document.getElementById('module-list-full');
    if (!moduleListElement) return;
    moduleListElement.innerHTML = ''; // Clear loading

    try {
        // --- Reverted to Static Data --- 
        // const modules = await apiRequest('/api/modules'); 
        const modules = [
            { id: 1, title: 'POS Basics Training', description: 'Learn the point-of-sale system.', status: 'Not Started', progress: 0 },
            { id: 2, title: 'Customer Service Essentials', description: 'Essential skills for customer interaction.', status: 'In Progress', progress: 50 },
            { id: 3, title: 'Workplace Safety', description: 'Mandatory safety procedures.', status: 'Completed', progress: 100 },
            { id: 4, title: 'Advanced Sales Techniques', description: 'Improve your sales performance.', status: 'Not Started', progress: 0 },
            { id: 5, title: 'Product Knowledge Course', description: 'Deep dive into our product catalog.', status: 'Not Started', progress: 0 },
        ];
        // --- End Static Data ---

        if (modules && modules.length > 0) {
            moduleListElement.innerHTML = ''; // Clear loading
            modules.forEach(module => {
                const card = document.createElement('div');
                card.className = 'module-card';
                let statusText = 'Not Started'; 
                let iconClass = 'fa-solid fa-play';
                 if (module.status === 'Completed') {
                    statusText = 'Completed';
                    iconClass = 'fa-solid fa-check';
                    card.classList.add('completed');
                } else if (module.status === 'In Progress') {
                    statusText = `${module.progress}% Complete`;
                }
                card.innerHTML = `
                    <h3>${module.title}</h3>
                    <p>${module.description || ''}</p> 
                    <p><small>Status: ${statusText}</small></p> 
                    <a href="module.html?moduleId=${module.id}" class="button play-button"><i class="${iconClass}"></i></a>
                `;
                moduleListElement.appendChild(card);
            });
        } else {
            moduleListElement.innerHTML = '<p>No modules available.</p>';
        }
    } catch (error) {
        console.error('Error processing static modules:', error);
        moduleListElement.innerHTML = '<p class="error-message">Could not display modules.</p>';
    }
} 