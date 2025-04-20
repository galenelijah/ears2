// Base URL for the API (Adjust if your backend runs on a different port/host)
const API_BASE_URL = 'http://localhost:5000/api'; // Assuming backend runs on 5000

// Function to handle API requests
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found.');
            // Redirect to login if not on login/register page and token is missing
            if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('register.html')) {
                window.location.href = '/index.html'; // Adjust path if needed
            }
            return Promise.reject('Authentication token not found.'); 
        }
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        // Handle cases where the response might not have a body (e.g., 204 No Content)
        if (response.status === 204) {
            return null; // Or return an empty object/success indicator
        }

        const responseData = await response.json(); 

        if (!response.ok) {
            // Log the detailed error from the backend if available
            console.error(`API Error (${response.status}):`, responseData);
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('API Request Failed:', error);
        // Display error to the user (can be improved with a dedicated UI element)
        alert(`An error occurred: ${error.message || 'Network error or failed request'}`);
        throw error; // Re-throw the error for further handling if needed
    }
}

// Helper function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Helper function to display messages
function showMessage(elementId, message, isError = true) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = 'message'; // Reset class
    if (isError) {
        messageElement.classList.add('error-message');
    } else {
        messageElement.classList.add('success-message');
    }
    messageElement.style.display = 'block';

    // Optionally hide the message after some time
    // setTimeout(() => {
    //     messageElement.style.display = 'none';
    // }, 5000); 
}

function hideMessage(elementId) {
     const messageElement = document.getElementById(elementId);
     if (messageElement) {
        messageElement.style.display = 'none';
        messageElement.textContent = '';
     }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    // Redirect to login page
    window.location.href = '/index.html'; // Adjust path if needed
}

// Function to check authentication and redirect if necessary
function checkAuth(requiredRole = null) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // If no token, redirect to login (unless on login/register)
    if (!token) {
        if (!window.location.pathname.includes('index.html') && !window.location.pathname.includes('register.html')) {
             console.log('No token found, redirecting to login.');
             window.location.href = '/index.html'; // Adjust path if needed
        }
        return false; // Not authenticated
    }

    // If a specific role is required, check if the user has it
    if (requiredRole && userRole !== requiredRole) {
        console.log(`Role mismatch: Required ${requiredRole}, User has ${userRole}. Redirecting.`);
        // Redirect based on actual role or to login
        if (userRole === 'admin') {
            window.location.href = '/admin/dashboard.html'; // Adjust path if needed
        } else if (userRole === 'employee') {
            window.location.href = '/employee/home.html'; // Adjust path if needed
        } else {
            window.location.href = '/index.html'; // Fallback to login
        }
        return false; // Incorrect role
    }

    return true; // Authenticated and has the correct role (if required)
} 