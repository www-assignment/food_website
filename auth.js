// ===== THE CEO GRILLS - AUTHENTICATION SYSTEM =====
// File: auth.js

// ===== AUTHENTICATION STATE =====
const AuthState = {
    user: null,
    isLoggedIn: false,
    userProfile: null,
    loading: true
};

// ===== GLOBAL VARIABLES =====
let authModal = null;
let profileModal = null;
let db = null;

// ===== INITIALIZE AUTH SYSTEM =====
function initAuthSystem() {
    console.log('🔐 Initializing authentication system...');
    
    try {
        // Initialize Firestore
        db = firebase.firestore();
        
        // Create auth modal if it doesn't exist
        createAuthModal();
        
        // Create profile modal
        createProfileModal();
        
        // Set up auth state listener
        setupAuthListener();
        
        // Set up event listeners
        setupAuthEventListeners();
        
        console.log('✅ Authentication system initialized');
    } catch (error) {
        console.error('Error initializing auth system:', error);
    }
}

// ===== CREATE AUTH MODAL =====
function createAuthModal() {
    // Check if modal already exists
    if (document.getElementById('authModal')) {
        authModal = document.getElementById('authModal');
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
    <div class="modal-overlay auth-modal-overlay" id="authModal" aria-hidden="true">
        <div class="modal-container auth-modal-container" role="dialog" aria-labelledby="authModalTitle">
            <!-- Close Button -->
            <button class="auth-modal-close" id="closeAuthModal" aria-label="Close authentication">
                <i class="fas fa-times"></i>
            </button>
            
            <!-- Tabs Container -->
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login" id="loginTabBtn">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
                <button class="auth-tab" data-tab="signup" id="signupTabBtn">
                    <i class="fas fa-user-plus"></i> Sign Up
                </button>
                <button class="auth-tab" data-tab="forgot" id="forgotTabBtn">
                    <i class="fas fa-key"></i> Reset Password
                </button>
            </div>
            
            <!-- Login Form -->
            <div class="auth-form active" id="loginForm">
                <div class="form-header">
                    <h3><i class="fas fa-fire"></i> Welcome Back!</h3>
                    <p>Login to access your order history and rewards</p>
                </div>
                
                <div class="social-login">
                    <button class="btn-social google" id="googleLogin">
                        <i class="fab fa-google"></i> Continue with Google
                    </button>
                </div>
                
                <div class="divider">
                    <span>or</span>
                </div>
                
                <form id="loginEmailForm">
                    <div class="form-group">
                        <label for="loginEmail"><i class="fas fa-envelope"></i> Email Address</label>
                        <input type="email" id="loginEmail" required placeholder="your@email.com">
                    </div>
                    
                    <div class="form-group">
                        <div class="password-header">
                            <label for="loginPassword"><i class="fas fa-lock"></i> Password</label>
                            <button type="button" class="btn-forgot-tab" data-tab="forgot">
                                Forgot Password?
                            </button>
                        </div>
                        <input type="password" id="loginPassword" required placeholder="Enter your password">
                        <button type="button" class="btn-toggle-password" data-target="loginPassword">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <div class="form-group remember">
                        <input type="checkbox" id="rememberMe">
                        <label for="rememberMe">Remember me</label>
                    </div>
                    
                    <button type="submit" class="btn-auth-submit">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </form>
            </div>
            
            <!-- Signup Form -->
            <div class="auth-form" id="signupForm">
                <div class="form-header">
                    <h3><i class="fas fa-fire"></i> Join The CEO Grills</h3>
                    <p>Create an account to track orders and earn rewards</p>
                </div>
                
                <form id="signupEmailForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="signupFirstName"><i class="fas fa-user"></i> First Name</label>
                            <input type="text" id="signupFirstName" required placeholder="John">
                        </div>
                        <div class="form-group">
                            <label for="signupLastName"><i class="fas fa-user"></i> Last Name</label>
                            <input type="text" id="signupLastName" required placeholder="Doe">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="signupEmail"><i class="fas fa-envelope"></i> Email Address</label>
                        <input type="email" id="signupEmail" required placeholder="your@email.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="signupPhone"><i class="fas fa-phone"></i> Phone Number</label>
                        <input type="tel" id="signupPhone" required placeholder="0703 059 3267">
                    </div>
                    
                    <div class="form-group">
                        <label for="signupPassword"><i class="fas fa-lock"></i> Password</label>
                        <input type="password" id="signupPassword" required placeholder="Create a password">
                        <button type="button" class="btn-toggle-password" data-target="signupPassword">
                            <i class="fas fa-eye"></i>
                        </button>
                        <div class="password-strength">
                            <div class="strength-bar"></div>
                            <span class="strength-text">Password strength: <span>Weak</span></span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="signupConfirmPassword"><i class="fas fa-lock"></i> Confirm Password</label>
                        <input type="password" id="signupConfirmPassword" required placeholder="Confirm your password">
                        <button type="button" class="btn-toggle-password" data-target="signupConfirmPassword">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <div class="form-group terms">
                        <input type="checkbox" id="acceptTerms" required>
                        <label for="acceptTerms">
                            I agree to the <a href="#" class="link-terms">Terms & Conditions</a> and 
                            <a href="#" class="link-terms">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-auth-submit">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </form>
            </div>
            
            <!-- Forgot Password Form -->
            <div class="auth-form" id="forgotPasswordForm">
                <div class="form-header">
                    <h3><i class="fas fa-key"></i> Reset Password</h3>
                    <p>Enter your email to receive reset instructions</p>
                </div>
                
                <form id="forgotPasswordEmailForm">
                    <div class="form-group">
                        <label for="forgotEmail"><i class="fas fa-envelope"></i> Email Address</label>
                        <input type="email" id="forgotEmail" required placeholder="your@email.com">
                    </div>
                    
                    <button type="submit" class="btn-auth-submit">
                        <i class="fas fa-paper-plane"></i> Send Reset Link
                    </button>
                    
                    <div class="form-footer">
                        <p>Remember your password? <button type="button" class="btn-switch-tab" data-tab="login">Back to Login</button></p>
                    </div>
                </form>
            </div>
            
            <!-- Modal Footer -->
            <div class="auth-modal-footer">
                <p>By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
            </div>
        </div>
    </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get references
    authModal = document.getElementById('authModal');
    
    console.log('✅ Auth modal created');
}

// ===== CREATE PROFILE MODAL =====
function createProfileModal() {
    // Check if modal already exists
    if (document.getElementById('profileModal')) {
        profileModal = document.getElementById('profileModal');
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
    <div class="modal-overlay profile-modal-overlay" id="profileModal" aria-hidden="true">
        <div class="modal-container profile-modal-container" role="dialog" aria-labelledby="profileModalTitle">
            <!-- Close Button -->
            <button class="profile-modal-close" id="closeProfileModal" aria-label="Close profile">
                <i class="fas fa-times"></i>
            </button>
            
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-avatar" id="profileUserAvatar">
                    <span id="avatarInitials">U</span>
                    <div class="avatar-status online"></div>
                </div>
                <div class="profile-info">
                    <h3 id="userFullName">Loading...</h3>
                    <p id="userEmail">user@email.com</p>
                    <div class="member-since">
                        <i class="far fa-calendar"></i> Member since <span id="memberSince">2024</span>
                    </div>
                </div>
                <button class="btn-edit-profile" id="editProfileBtn">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            
            <!-- Profile Tabs -->
            <div class="profile-tabs">
                <button class="profile-tab active" data-tab="overview" id="overviewTab">
                    <i class="fas fa-home"></i> Overview
                </button>
                <button class="profile-tab" data-tab="orders" id="ordersTab">
                    <i class="fas fa-receipt"></i> Orders
                    <span class="tab-badge" id="ordersCount">0</span>
                </button>
                <button class="profile-tab" data-tab="settings" id="settingsTab">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
            
            <!-- Profile Content -->
            <div class="profile-content">
                <!-- Overview Tab -->
                <div class="profile-tab-content active" id="overviewContent">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Total Orders</h4>
                                <div class="stat-number" id="totalOrdersCount">0</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Total Spent</h4>
                                <div class="stat-number" id="totalSpent">₦0</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="stat-info">
                                <h4>Reward Points</h4>
                                <div class="stat-number" id="rewardPoints">0</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-crown"></i>
                            </div>
                            <div class="stat-info">
                                <h4>VIP Level</h4>
                                <div class="stat-number" id="vipLevel">Bronze</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-actions">
                        <h4><i class="fas fa-bolt"></i> Quick Actions</h4>
                        <div class="actions-grid">
                            <button class="action-btn" onclick="openProfileTab('orders')">
                                <i class="fas fa-receipt"></i>
                                <span>View Orders</span>
                            </button>
                            <button class="action-btn" onclick="closeProfileModal(); scrollToSection('fire-menu')">
                                <i class="fas fa-fire"></i>
                                <span>Order Food</span>
                            </button>
                            <button class="action-btn" onclick="openProfileTab('settings')">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Orders Tab -->
                <div class="profile-tab-content" id="ordersContent">
                    <div class="orders-header">
                        <h4><i class="fas fa-receipt"></i> Order History</h4>
                    </div>
                    <div class="orders-container" id="ordersContainer">
                        <!-- Orders will be loaded here -->
                        <div class="empty-orders">
                            <i class="fas fa-receipt"></i>
                            <p>No orders yet</p>
                            <button class="btn-order-now" onclick="closeProfileModal(); scrollToSection('fire-menu')">
                                <i class="fas fa-fire"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Settings Tab -->
                <div class="profile-tab-content" id="settingsContent">
                    <h4><i class="fas fa-cog"></i> Account Settings</h4>
                    
                    <div class="settings-section">
                        <h5><i class="fas fa-user"></i> Personal Information</h5>
                        <div class="user-info-display">
                            <p><strong>Name:</strong> <span id="displayUserName">Loading...</span></p>
                            <p><strong>Email:</strong> <span id="displayUserEmail">Loading...</span></p>
                            <p><strong>Phone:</strong> <span id="displayUserPhone">Loading...</span></p>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h5><i class="fas fa-lock"></i> Security</h5>
                        <button class="btn-change-password" onclick="openChangePasswordModal()">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                    </div>
                    
                    <div class="settings-section danger">
                        <h5><i class="fas fa-exclamation-triangle"></i> Danger Zone</h5>
                        <button class="btn-logout" onclick="logoutUser()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Get reference
    profileModal = document.getElementById('profileModal');
    
    console.log('✅ Profile modal created');
}

// ===== SETUP AUTH LISTENER =====
function setupAuthListener() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            AuthState.user = user;
            AuthState.isLoggedIn = true;
            
            console.log('User signed in:', user.email);
            
            // Load user profile from Firestore
            loadUserProfile(user.uid);
            
            // Update UI for logged-in state
            updateAuthUI();
            
        } else {
            // User is signed out
            AuthState.user = null;
            AuthState.isLoggedIn = false;
            AuthState.userProfile = null;
            
            console.log('User signed out');
            
            // Update UI for logged-out state
            updateAuthUI();
        }
        
        AuthState.loading = false;
    });
}

// ===== SETUP EVENT LISTENERS =====
function setupAuthEventListeners() {
    // Open auth modal when clicking user button
    document.addEventListener('click', (e) => {
        // Check if clicked element or parent is the user button
        const userBtn = e.target.closest('#navUserBtn') || 
                       e.target.closest('.user-avatar') ||
                       e.target.closest('.user-name') ||
                       (e.target.classList.contains('nav-user') && e.target.id === 'navUserBtn');
        
        if (userBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            if (AuthState.isLoggedIn) {
                // If user is logged in, open profile modal
                openProfileModal();
            } else {
                // If user is not logged in, open auth modal
                openAuthModal('login');
            }
        }
    });
    
    // Setup tab switching in auth modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('auth-tab') || e.target.closest('.auth-tab')) {
            const tabBtn = e.target.closest('.auth-tab');
            if (tabBtn) {
                const tab = tabBtn.dataset.tab;
                switchAuthTab(tab);
            }
        }
        
        if (e.target.classList.contains('btn-switch-tab') || e.target.closest('.btn-switch-tab')) {
            const btn = e.target.closest('.btn-switch-tab');
            if (btn) {
                const tab = btn.dataset.tab;
                switchAuthTab(tab);
            }
        }
        
        if (e.target.classList.contains('btn-forgot-tab') || e.target.closest('.btn-forgot-tab')) {
            switchAuthTab('forgot');
        }
    });
    
    // Toggle password visibility
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-toggle-password') || e.target.closest('.btn-toggle-password')) {
            const btn = e.target.closest('.btn-toggle-password');
            if (btn) {
                const targetId = btn.dataset.target;
                const passwordInput = document.getElementById(targetId);
                const icon = btn.querySelector('i');
                
                if (passwordInput && icon) {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.className = 'fas fa-eye-slash';
                    } else {
                        passwordInput.type = 'password';
                        icon.className = 'fas fa-eye';
                    }
                }
            }
        }
    });
    
    // Close modals
    document.addEventListener('click', (e) => {
        if (e.target.id === 'closeAuthModal' || e.target.closest('#closeAuthModal')) {
            closeAuthModal();
        }
        
        if (e.target.id === 'closeProfileModal' || e.target.closest('#closeProfileModal')) {
            closeProfileModal();
        }
        
        if (e.target.classList.contains('auth-modal-overlay')) {
            closeAuthModal();
        }
        
        if (e.target.classList.contains('profile-modal-overlay')) {
            closeProfileModal();
        }
    });
    
    // Form submissions
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'loginEmailForm') {
            e.preventDefault();
            loginWithEmail();
        }
        
        if (e.target.id === 'signupEmailForm') {
            e.preventDefault();
            signupWithEmail();
        }
        
        if (e.target.id === 'forgotPasswordEmailForm') {
            e.preventDefault();
            resetPassword();
        }
    });
    
    // Google login
    document.addEventListener('click', (e) => {
        if (e.target.id === 'googleLogin' || e.target.closest('#googleLogin')) {
            e.preventDefault();
            loginWithGoogle();
        }
    });
    
    // Profile tab switching
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('profile-tab') || e.target.closest('.profile-tab')) {
            const tabBtn = e.target.closest('.profile-tab');
            if (tabBtn) {
                const tab = tabBtn.dataset.tab;
                openProfileTab(tab);
            }
        }
    });
}

// ===== AUTH FUNCTIONS =====

// Login with email/password
async function loginWithEmail() {
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            showToast('Please enter both email and password', 'error');
            return;
        }
        
        // Show loading
        showAuthLoading(true);
        
        // Sign in with Firebase
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        // Success
        showToast('Login successful! Welcome back!', 'success');
        closeAuthModal();
        
        // Clear form
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failed. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
        }
        
        showToast(errorMessage, 'error');
    } finally {
        showAuthLoading(false);
    }
}

// Sign up with email/password
async function signupWithEmail() {
    try {
        const firstName = document.getElementById('signupFirstName').value.trim();
        const lastName = document.getElementById('signupLastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        // Validation
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        // Show loading
        showAuthLoading(true);
        
        // Create user in Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Create user profile in Firestore
        await createUserProfile(userCredential.user.uid, {
            firstName,
            lastName,
            email,
            phone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            role: 'customer',
            rewardPoints: 100, // Welcome bonus
            vipLevel: 'bronze',
            totalOrders: 0,
            totalSpent: 0
        });
        
        // Send verification email (optional)
        // await userCredential.user.sendEmailVerification();
        
        // Success
        showToast('Account created successfully! Welcome to The CEO Grills!', 'success');
        closeAuthModal();
        
        // Clear form
        document.getElementById('signupFirstName').value = '';
        document.getElementById('signupLastName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPhone').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirmPassword').value = '';
        
    } catch (error) {
        console.error('Signup error:', error);
        
        let errorMessage = 'Signup failed. Please try again.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please choose a stronger password.';
                break;
        }
        
        showToast(errorMessage, 'error');
    } finally {
        showAuthLoading(false);
    }
}

// Login with Google
async function loginWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Show loading
        showAuthLoading(true);
        
        // Sign in with popup
        const result = await firebase.auth().signInWithPopup(provider);
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(result.user.uid).get();
        
        if (!userDoc.exists) {
            // Create user profile for first-time Google sign-in
            const displayName = result.user.displayName || '';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            await createUserProfile(result.user.uid, {
                firstName,
                lastName,
                email: result.user.email,
                phone: '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                role: 'customer',
                rewardPoints: 100, // Welcome bonus
                vipLevel: 'bronze',
                totalOrders: 0,
                totalSpent: 0,
                provider: 'google'
            });
        } else {
            // Update last login
            await db.collection('users').doc(result.user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Success
        showToast('Login successful with Google!', 'success');
        closeAuthModal();
        
    } catch (error) {
        console.error('Google login error:', error);
        showToast('Google login failed. Please try again.', 'error');
    } finally {
        showAuthLoading(false);
    }
}

// Reset password
async function resetPassword() {
    try {
        const email = document.getElementById('forgotEmail').value;
        
        if (!email) {
            showToast('Please enter your email address', 'error');
            return;
        }
        
        // Show loading
        showAuthLoading(true);
        
        // Send password reset email
        await firebase.auth().sendPasswordResetEmail(email);
        
        // Success
        showToast('Password reset email sent! Check your inbox.', 'success');
        
        // Switch back to login tab
        setTimeout(() => {
            switchAuthTab('login');
            document.getElementById('forgotEmail').value = '';
        }, 2000);
        
    } catch (error) {
        console.error('Reset password error:', error);
        
        let errorMessage = 'Failed to send reset email. Please try again.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        }
        
        showToast(errorMessage, 'error');
    } finally {
        showAuthLoading(false);
    }
}

// Create user profile in Firestore
async function createUserProfile(userId, profileData) {
    try {
        await db.collection('users').doc(userId).set(profileData);
        console.log('User profile created for:', userId);
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        return false;
    }
}

// Load user profile from Firestore
async function loadUserProfile(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        
        if (userDoc.exists) {
            AuthState.userProfile = {
                id: userDoc.id,
                ...userDoc.data()
            };
            console.log('User profile loaded:', AuthState.userProfile);
            
            // Update profile modal if open
            updateProfileModal();
            
            return true;
        } else {
            console.log('No profile found for user:', userId);
            // Create a basic profile if none exists
            const basicProfile = {
                firstName: AuthState.user.displayName?.split(' ')[0] || 'User',
                lastName: AuthState.user.displayName?.split(' ').slice(1).join(' ') || '',
                email: AuthState.user.email,
                phone: '',
                rewardPoints: 0,
                vipLevel: 'bronze',
                totalOrders: 0,
                totalSpent: 0
            };
            await createUserProfile(userId, basicProfile);
            await loadUserProfile(userId); // Reload
            return false;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        return false;
    }
}

// Update user profile
async function updateUserProfile(updates) {
    if (!AuthState.user || !AuthState.userProfile) return false;
    
    try {
        await db.collection('users').doc(AuthState.user.uid).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Reload profile
        await loadUserProfile(AuthState.user.uid);
        
        showToast('Profile updated successfully!', 'success');
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Failed to update profile', 'error');
        return false;
    }
}

// Logout user
async function logoutUser() {
    try {
        await firebase.auth().signOut();
        showToast('Logged out successfully', 'info');
        closeProfileModal();
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Logout failed', 'error');
    }
}

// ===== UI FUNCTIONS =====

// Open auth modal
function openAuthModal(tab = 'login') {
    if (!authModal) createAuthModal();
    
    authModal.classList.add('active');
    authModal.style.display = 'flex';
    
    switchAuthTab(tab);
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = authModal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

// Close auth modal
function closeAuthModal() {
    if (authModal) {
        authModal.classList.remove('active');
        setTimeout(() => {
            authModal.style.display = 'none';
        }, 300);
    }
}

// Switch auth tab
function switchAuthTab(tab) {
    if (!authModal) return;
    
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
    
    // Update forms visibility
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const activeForm = document.getElementById(tab === 'login' ? 'loginForm' : 
                                              tab === 'signup' ? 'signupForm' : 
                                              'forgotPasswordForm');
    if (activeForm) activeForm.classList.add('active');
}

// Open profile modal
function openProfileModal(tab = 'overview') {
    if (!profileModal) createProfileModal();
    
    // Update profile data
    updateProfileModal();
    
    profileModal.classList.add('active');
    profileModal.style.display = 'flex';
    
    openProfileTab(tab);
    
    // Load orders if opening orders tab
    if (tab === 'orders') {
        loadUserOrders();
    }
}

// Close profile modal
function closeProfileModal() {
    if (profileModal) {
        profileModal.classList.remove('active');
        setTimeout(() => {
            profileModal.style.display = 'none';
        }, 300);
    }
}

// Open profile tab
function openProfileTab(tab) {
    if (!profileModal) return;
    
    // Update tab buttons
    document.querySelectorAll('.profile-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) btn.classList.add('active');
    });
    
    // Update content visibility
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(tab + 'Content');
    if (activeContent) activeContent.classList.add('active');
    
    // Load data for specific tabs
    if (tab === 'orders') {
        loadUserOrders();
    }
}

// Update auth UI based on login state
function updateAuthUI() {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (userAvatar && userName) {
        if (AuthState.isLoggedIn && AuthState.user) {
            // Show user info
            const initials = getInitials(
                AuthState.userProfile?.firstName, 
                AuthState.userProfile?.lastName
            );
            
            userAvatar.innerHTML = `<span class="avatar-initials">${initials}</span>`;
            userName.textContent = AuthState.userProfile?.firstName || 'User';
            
            // Add logged-in class for styling
            document.getElementById('navUserBtn').classList.add('logged-in');
            
        } else {
            // Show login button
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            userName.textContent = 'Login';
            
            // Remove logged-in class
            document.getElementById('navUserBtn').classList.remove('logged-in');
        }
    }
}

// Update profile modal with user data
function updateProfileModal() {
    if (!AuthState.userProfile || !profileModal) return;
    
    // Update avatar initials
    const avatarInitials = document.getElementById('avatarInitials');
    if (avatarInitials) {
        avatarInitials.textContent = getInitials(
            AuthState.userProfile.firstName, 
            AuthState.userProfile.lastName
        );
    }
    
    // Update user info
    const userFullName = document.getElementById('userFullName');
    if (userFullName) {
        userFullName.textContent = `${AuthState.userProfile.firstName} ${AuthState.userProfile.lastName}`;
    }
    
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.textContent = AuthState.userProfile.email;
    }
    
    const memberSince = document.getElementById('memberSince');
    if (memberSince && AuthState.userProfile.createdAt) {
        let date;
        if (AuthState.userProfile.createdAt.toDate) {
            date = AuthState.userProfile.createdAt.toDate();
        } else if (AuthState.userProfile.createdAt instanceof Date) {
            date = AuthState.userProfile.createdAt;
        } else {
            date = new Date(AuthState.userProfile.createdAt);
        }
        memberSince.textContent = date.getFullYear();
    }
    
    // Update stats
    const totalOrdersCount = document.getElementById('totalOrdersCount');
    if (totalOrdersCount) {
        totalOrdersCount.textContent = AuthState.userProfile.totalOrders || 0;
    }
    
    const totalSpent = document.getElementById('totalSpent');
    if (totalSpent) {
        totalSpent.textContent = formatCurrency ? formatCurrency(AuthState.userProfile.totalSpent || 0) : `₦${(AuthState.userProfile.totalSpent || 0).toLocaleString()}`;
    }
    
    const rewardPoints = document.getElementById('rewardPoints');
    if (rewardPoints) {
        rewardPoints.textContent = AuthState.userProfile.rewardPoints || 0;
    }
    
    const vipLevel = document.getElementById('vipLevel');
    if (vipLevel) {
        vipLevel.textContent = AuthState.userProfile.vipLevel 
            ? AuthState.userProfile.vipLevel.charAt(0).toUpperCase() + AuthState.userProfile.vipLevel.slice(1)
            : 'Bronze';
    }
    
    const ordersCount = document.getElementById('ordersCount');
    if (ordersCount) {
        ordersCount.textContent = AuthState.userProfile.totalOrders || 0;
    }
    
    // Update settings display
    const displayUserName = document.getElementById('displayUserName');
    if (displayUserName) {
        displayUserName.textContent = `${AuthState.userProfile.firstName} ${AuthState.userProfile.lastName}`;
    }
    
    const displayUserEmail = document.getElementById('displayUserEmail');
    if (displayUserEmail) {
        displayUserEmail.textContent = AuthState.userProfile.email;
    }
    
    const displayUserPhone = document.getElementById('displayUserPhone');
    if (displayUserPhone) {
        displayUserPhone.textContent = AuthState.userProfile.phone || 'Not set';
    }
}

// Load user orders
async function loadUserOrders() {
    if (!AuthState.user || !AuthState.userProfile) return;
    
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    // Show loading
    ordersContainer.innerHTML = `
        <div class="loading-orders">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading your orders...</p>
        </div>
    `;
    
    try {
        // For now, load from localStorage
        const savedOrders = localStorage.getItem('ceoGrillsOrders');
        const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
        
        // Filter orders for current user
        const userOrders = allOrders.filter(order => 
            order.userId === AuthState.user.uid || 
            order.userEmail === AuthState.user.email
        );
        
        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-receipt"></i>
                    <p>No orders yet</p>
                    <button class="btn-order-now" onclick="closeProfileModal(); scrollToSection('fire-menu')">
                        <i class="fas fa-fire"></i> Place Your First Order
                    </button>
                </div>
            `;
            return;
        }
        
        // Build orders HTML
        let ordersHTML = '';
        userOrders.slice().reverse().forEach(order => {
            ordersHTML += createOrderCard(order);
        });
        
        ordersContainer.innerHTML = ordersHTML;
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersContainer.innerHTML = `
            <div class="error-loading">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load orders</p>
                <button onclick="loadUserOrders()" class="btn-retry">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
}

// Create order card HTML
function createOrderCard(order) {
    const date = order.date ? new Date(order.date) : new Date();
    
    const formattedDate = date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const statusColors = {
        'pending': 'warning',
        'confirmed': 'info',
        'preparing': 'primary',
        'delivered': 'success',
        'cancelled': 'danger'
    };
    
    const statusText = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    const statusColor = statusColors[order.status] || 'warning';
    const statusDisplay = statusText[order.status] || 'Pending';
    
    // Calculate total
    const subtotal = order.items?.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) || 0;
    const deliveryFee = 500; // Default delivery fee
    const total = subtotal + deliveryFee;
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">
                    <strong>Order #${order.id || order.id}</strong>
                    <span class="order-date">${formattedDate}</span>
                </div>
                <div class="order-status status-${statusColor}">
                    ${statusDisplay}
                </div>
            </div>
            
            <div class="order-summary">
                <div class="order-items">
                    ${order.items?.slice(0, 2).map(item => `
                        <div class="order-item">
                            <span class="item-name">${item.name} × ${item.quantity || 1}</span>
                            <span class="item-price">${formatCurrency ? formatCurrency(item.price * (item.quantity || 1)) : `₦${(item.price * (item.quantity || 1)).toLocaleString()}`}</span>
                        </div>
                    `).join('')}
                    ${order.items?.length > 2 ? `<div class="more-items">+${order.items.length - 2} more items</div>` : ''}
                </div>
                
                <div class="order-total">
                    <span>Total:</span>
                    <span class="total-amount">${formatCurrency ? formatCurrency(total) : `₦${total.toLocaleString()}`}</span>
                </div>
            </div>
            
            <div class="order-actions">
                <button class="btn-view-order" onclick="showToast('Order details coming soon!', 'info')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'delivered' ? `
                <button class="btn-reorder" onclick="showToast('Reorder feature coming soon!', 'info')">
                    <i class="fas fa-redo"></i> Reorder
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ===== UTILITY FUNCTIONS =====

// Get initials from name
function getInitials(firstName = '', lastName = '') {
    const first = firstName ? firstName[0].toUpperCase() : 'U';
    const last = lastName ? lastName[0].toUpperCase() : '';
    return first + (last ? last : '');
}

// Show loading state in auth modal
function showAuthLoading(show) {
    const submitBtns = document.querySelectorAll('.btn-auth-submit');
    submitBtns.forEach(btn => {
        if (show) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;
        } else {
            // Restore original text based on form
            const form = btn.closest('form');
            if (form?.id === 'loginEmailForm') {
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            } else if (form?.id === 'signupEmailForm') {
                btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            } else if (form?.id === 'forgotPasswordEmailForm') {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
            }
            btn.disabled = false;
        }
    });
}

// Show toast message
function showToast(message, type = 'info') {
    // Check if showToast function exists in script.js
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        // Fallback toast
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}

// Format currency
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

// ===== EXPORT FUNCTIONS =====
window.initAuthSystem = initAuthSystem;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.logoutUser = logoutUser;
window.loadUserOrders = loadUserOrders;

console.log('🔐 Auth system loaded');