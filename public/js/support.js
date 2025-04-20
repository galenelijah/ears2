document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth('employee')) {
        return;
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // TODO: Implement user role display if needed
    
    console.log('Support page loaded');
    // Add any specific JS for the support page here, e.g.:
    // - Handling a contact form submission
    // - Loading FAQs dynamically 
});

// Example: function handleContactFormSubmit(event) {
//     event.preventDefault();
//     // Get form data
//     // Call apiRequest to send data
//     // Show success/error message
// } 