// login.js - Firebase Authentication for Admin Dashboard

// Import Firebase configuration
document.addEventListener('DOMContentLoaded', function() {
    // Load Firebase config from main site
    const script = document.createElement('script');
    script.src = '../js/firebase-config.js';
    script.onload = function() {
        initializeAuth();
    };
    document.head.appendChild(script);
});

function initializeAuth() {
    // Check if Firebase is already initialized
    if (!window.firebaseApp) {
        console.error('Firebase not initialized. Check firebase-config.js');
        showError('Firebase configuration error. Please check your settings.');
        return;
    }

    // Initialize Auth
    const auth = firebase.auth();
    
    // Check if user is already logged in
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User already logged in:', user.email);
            showSuccess('Already logged in, redirecting...');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            console.log('No user logged in');
            hideLoading();
        }
    });

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                showError('Please enter email and password');
                return;
            }
            
            showLoading(true);
            hideMessages();
            
            try {
                // Sign in user
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                
                // Success
                console.log('Login successful:', userCredential.user.email);
                showSuccess('Login successful! Redirecting to dashboard...');
                
                // Store login state
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', userCredential.user.email);
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1500);
                
            } catch (error) {
                // Handle errors
                console.error('Login error:', error);
                let errorMessage = 'Invalid email or password';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Account has been disabled';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many failed attempts. Try again later';
                        break;
                    case 'auth/configuration-not-found':
                        errorMessage = 'Authentication not configured. Enable Firebase Auth.';
                        break;
                    default:
                        errorMessage = error.message || 'Login failed';
                }
                
                showError(errorMessage);
                showLoading(false);
            }
        });
    }
}

// UI Helper Functions
function showLoading(show) {
    const form = document.getElementById('loginForm');
    const loading = document.getElementById('loadingState');
    const btn = document.getElementById('loginBtn');
    
    if (show) {
        form.classList.add('hidden');
        loading.classList.remove('hidden');
        btn.disabled = true;
    } else {
        form.classList.remove('hidden');
        loading.classList.add('hidden');
        btn.disabled = false;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    if (errorText) errorText.textContent = message;
    if (errorDiv) errorDiv.classList.remove('hidden');
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    if (successText) successText.textContent = message;
    if (successDiv) successDiv.classList.remove('hidden');
}

function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    if (errorDiv) errorDiv.classList.add('hidden');
    if (successDiv) successDiv.classList.add('hidden');
}
