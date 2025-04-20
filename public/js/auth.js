document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    hideMessage('login-message'); // Hide previous messages
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = event.submitter;

    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    try {
        const data = await apiRequest('/auth/login', 'POST', { email, password }, false); // No auth needed for login

        if (data && data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.user.role);
            localStorage.setItem('userName', data.user.name); // Store user's name

            // Redirect based on role
            if (data.user.role === 'admin') {
                window.location.href = '/admin/dashboard.html'; // Adjust path if needed
            } else if (data.user.role === 'employee') {
                window.location.href = '/employee/home.html'; // Adjust path if needed
            } else {
                // Handle unexpected role or show error
                console.error('Unknown user role:', data.user.role);
                showMessage('login-message', 'Login successful, but user role is unrecognized.', true);
                // Maybe redirect to a default page or show a specific message
            }
        } else {
             showMessage('login-message', 'Login failed: Invalid response from server.', true);
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('login-message', error.message || 'Login failed. Please check your credentials.', true);
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    hideMessage('register-message'); // Hide previous messages
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const registerButton = event.submitter;

    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';

    try {
        const data = await apiRequest('/auth/register', 'POST', { name, email, password }, false); // No auth needed for register
        
        showMessage('register-message', 'Registration successful! You can now log in.', false);
        // Optionally redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = '/index.html'; // Adjust path if needed
        }, 2000); 

    } catch (error) {
        console.error('Registration error:', error);
        showMessage('register-message', error.message || 'Registration failed. Please try again.', true);
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
    }
    // No finally block needed for button state if redirecting on success
} 