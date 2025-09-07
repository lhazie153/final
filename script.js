// Drukains Today JavaScript

// Global variables
let currentUser = null;
let currentSection = 'home';

// API Base URL
const API_BASE = '/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// Authentication Functions
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE}/auth/check-auth`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            showAuthenticatedUI();
            loadHomeContent();
        } else {
            showUnauthenticatedUI();
        }
        
        hideLoading();
        showSection('home');
    } catch (error) {
        console.error('Auth check failed:', error);
        showUnauthenticatedUI();
        hideLoading();
        showSection('home');
    }
}

function showAuthenticatedUI() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';
    document.getElementById('user-name').textContent = `${currentUser.first_name} ${currentUser.last_name}`;
    
    // Show navigation items based on user role
    document.getElementById('nav-articles').style.display = 'block';
    document.getElementById('nav-announcements').style.display = 'block';
    document.getElementById('nav-reminders').style.display = 'block';
    
    if (currentUser.role === 'admin') {
        document.getElementById('nav-admin').style.display = 'block';
    }
    
    // Show create buttons for authorized users
    if (currentUser.role === 'admin' || currentUser.role === 'language_teacher') {
        document.getElementById('create-article-btn').style.display = 'block';
        document.getElementById('create-announcement-btn').style.display = 'block';
        document.getElementById('create-reminder-btn').style.display = 'block';
    }
}

function showUnauthenticatedUI() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('user-section').style.display = 'none';
    
    // Hide navigation items
    document.getElementById('nav-articles').style.display = 'none';
    document.getElementById('nav-announcements').style.display = 'none';
    document.getElementById('nav-reminders').style.display = 'none';
    document.getElementById('nav-admin').style.display = 'none';
    
    // Hide create buttons
    document.getElementById('create-article-btn').style.display = 'none';
    document.getElementById('create-announcement-btn').style.display = 'none';
    document.getElementById('create-reminder-btn').style.display = 'none';
    
    loadPublicContent();
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showAlert('Please enter username and password', 'danger');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password, remember })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showAlert('Login successful!', 'success');
            showAuthenticatedUI();
            loadHomeContent();
            showSection('home');
            
            // Clear form
            document.getElementById('loginForm').reset();
        } else {
            showAlert(data.error || 'Login failed', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed. Please try again.', 'danger');
    }
}

async function register() {
    const formData = {
        first_name: document.getElementById('regFirstName').value,
        last_name: document.getElementById('regLastName').value,
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        role: document.getElementById('regRole').value,
        grade_level: document.getElementById('regGradeLevel').value
    };
    
    // Validate required fields
    for (const [key, value] of Object.entries(formData)) {
        if (!value) {
            showAlert(`Please fill in ${key.replace('_', ' ')}`, 'danger');
            return;
        }
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            showAlert('Registration successful! Please login.', 'success');
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Show login modal
            setTimeout(() => {
                showLoginModal();
            }, 1000);
        } else {
            showAlert(data.error || 'Registration failed', 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'danger');
    }
}

async function logout() {
    try {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = null;
            showAlert('Logged out successfully', 'info');
            showUnauthenticatedUI();
            showSection('home');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Logout failed', 'danger');
    }
}

// Content Loading Functions
async function loadHomeContent() {
    try {
        // Load principal's note
        const principalResponse = await fetch(`${API_BASE}/posts?type=principal_note`, {
            credentials: 'include'
        });
        const principalData = await principalResponse.json();
        
        if (principalData.posts && principalData.posts.length > 0) {
            const note = principalData.posts[0];
            document.getElementById('principal-note').innerHTML = `
                <h6>${note.title}</h6>
                <p>${note.content.replace(/\n/g, '<br>')}</p>
                <small class="text-muted">Updated: ${new Date(note.updated_at).toLocaleDateString()}</small>
            `;
        }
        
        // Load recent articles
        const articlesResponse = await fetch(`${API_BASE}/posts?type=article`, {
            credentials: 'include'
        });
        const articlesData = await articlesResponse.json();
        
        if (articlesData.posts && articlesData.posts.length > 0) {
            const recentArticles = articlesData.posts.slice(0, 3);
            document.getElementById('recent-news').innerHTML = recentArticles.map(article => `
                <div class="mb-3">
                    <h6>${article.title}</h6>
                    <p class="text-muted small">${article.content.substring(0, 150)}...</p>
                    <small class="text-muted">By ${article.author_name} • ${new Date(article.created_at).toLocaleDateString()}</small>
                </div>
            `).join('<hr>');
        }
        
        // Load important reminders
        const remindersResponse = await fetch(`${API_BASE}/posts?type=reminder`, {
            credentials: 'include'
        });
        const remindersData = await remindersResponse.json();
        
        if (remindersData.posts && remindersData.posts.length > 0) {
            const importantReminders = remindersData.posts.slice(0, 5);
            document.getElementById('important-reminders').innerHTML = importantReminders.map(reminder => `
                <div class="mb-2">
                    <strong>${reminder.title}</strong>
                    <p class="small mb-1">${reminder.content}</p>
                    <small class="text-muted">${new Date(reminder.created_at).toLocaleDateString()}</small>
                </div>
            `).join('<hr>');
        }
        
        // Load monthly winners if user is authenticated
        if (currentUser) {
            loadMonthlyWinners();
        }
        
    } catch (error) {
        console.error('Error loading home content:', error);
    }
}

async function loadPublicContent() {
    document.getElementById('principal-note').innerHTML = '<p class="text-muted">Please login to view content.</p>';
    document.getElementById('recent-news').innerHTML = '<p class="text-muted">Please login to view content.</p>';
    document.getElementById('important-reminders').innerHTML = '<p class="text-muted">Please login to view content.</p>';
}

async function loadMonthlyWinners() {
    try {
        const response = await fetch(`${API_BASE}/posts/winners`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.winners && data.winners.length > 0) {
            document.getElementById('winners-card').style.display = 'block';
            document.getElementById('monthly-winners').innerHTML = data.winners.map(winner => `
                <div class="mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${winner.post_title}</strong>
                        <span class="badge bg-success">${winner.vote_count} votes</span>
                    </div>
                    <small class="text-muted">By ${winner.post_author} • ${winner.grade_level.toUpperCase()}</small>
                </div>
            `).join('<hr>');
        }
    } catch (error) {
        console.error('Error loading monthly winners:', error);
    }
}

async function loadArticles() {
    try {
        // Load top articles
        const topResponse = await fetch(`${API_BASE}/posts/top-articles`, {
            credentials: 'include'
        });
        const topData = await topResponse.json();
        
        if (topData.top_articles && topData.top_articles.length > 0) {
            document.getElementById('top-articles').innerHTML = topData.top_articles.map(article => 
                createPostCard(article, true)
            ).join('');
        } else {
            document.getElementById('top-articles').innerHTML = '<p class="text-muted">No articles have been voted on this month.</p>';
        }
        
        // Load all articles
        const allResponse = await fetch(`${API_BASE}/posts?type=article`, {
            credentials: 'include'
        });
        const allData = await allResponse.json();
        
        if (allData.posts && allData.posts.length > 0) {
            document.getElementById('all-articles').innerHTML = allData.posts.map(article => 
                createPostCard(article, true)
            ).join('');
        } else {
            document.getElementById('all-articles').innerHTML = '<p class="text-muted">No articles available.</p>';
        }
        
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('top-articles').innerHTML = '<p class="text-danger">Error loading articles.</p>';
        document.getElementById('all-articles').innerHTML = '<p class="text-danger">Error loading articles.</p>';
    }
}

async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_BASE}/posts?type=announcement`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
            document.getElementById('announcements-content').innerHTML = data.posts.map(post => 
                createPostCard(post, false)
            ).join('');
        } else {
            document.getElementById('announcements-content').innerHTML = '<p class="text-muted">No announcements available.</p>';
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
        document.getElementById('announcements-content').innerHTML = '<p class="text-danger">Error loading announcements.</p>';
    }
}

async function loadReminders() {
    try {
        const response = await fetch(`${API_BASE}/posts?type=reminder`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.posts && data.posts.length > 0) {
            document.getElementById('reminders-content').innerHTML = data.posts.map(post => 
                createPostCard(post, false)
            ).join('');
        } else {
            document.getElementById('reminders-content').innerHTML = '<p class="text-muted">No reminders available.</p>';
        }
    } catch (error) {
        console.error('Error loading reminders:', error);
        document.getElementById('reminders-content').innerHTML = '<p class="text-danger">Error loading reminders.</p>';
    }
}

async function loadAdminContent() {
    if (!currentUser || currentUser.role !== 'admin') {
        document.getElementById('admin-section').innerHTML = '<p class="text-danger">Access denied.</p>';
        return;
    }
    
    try {
        // Load statistics
        const statsResponse = await fetch(`${API_BASE}/admin/stats`, {
            credentials: 'include'
        });
        const statsData = await statsResponse.json();
        
        if (statsData.stats) {
            document.getElementById('total-users').textContent = statsData.stats.total_users;
            document.getElementById('total-posts').textContent = statsData.stats.total_posts;
            document.getElementById('total-votes').textContent = statsData.stats.total_votes;
            document.getElementById('active-users').textContent = statsData.stats.active_users;
        }
        
        // Load users for management
        const usersResponse = await fetch(`${API_BASE}/admin/users`, {
            credentials: 'include'
        });
        const usersData = await usersResponse.json();
        
        if (usersData.users) {
            document.getElementById('user-management').innerHTML = usersData.users.map(user => `
                <div class="user-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${user.first_name} ${user.last_name}</strong>
                            <br>
                            <small class="text-muted">${user.username} • ${user.email}</small>
                            <br>
                            <span class="badge role-badge">${user.role}</span>
                            <span class="badge grade-badge">${user.grade_level}</span>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${user.id !== currentUser.id ? `
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        // Load posts for management
        const postsResponse = await fetch(`${API_BASE}/admin/posts/all`, {
            credentials: 'include'
        });
        const postsData = await postsResponse.json();
        
        if (postsData.posts) {
            document.getElementById('content-management').innerHTML = postsData.posts.slice(0, 10).map(post => `
                <div class="user-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${post.title}</strong>
                            <br>
                            <small class="text-muted">By ${post.author_name} • ${new Date(post.created_at).toLocaleDateString()}</small>
                            <br>
                            <span class="badge bg-info">${post.post_type}</span>
                            <span class="badge grade-badge">${post.grade_level}</span>
                            ${post.is_published ? '<span class="badge bg-success">Published</span>' : '<span class="badge bg-warning">Draft</span>'}
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading admin content:', error);
    }
}

// Post Management Functions
async function createPost() {
    const postData = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        post_type: document.getElementById('postType').value,
        grade_level: document.getElementById('postGradeLevel').value
    };
    
    const expiration = document.getElementById('postExpiration').value;
    if (expiration) {
        postData.expires_at = new Date(expiration).toISOString();
    }
    
    // Validate required fields
    if (!postData.title || !postData.content || !postData.post_type || !postData.grade_level) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(postData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            bootstrap.Modal.getInstance(document.getElementById('createPostModal')).hide();
            showAlert('Post created successfully!', 'success');
            
            // Clear form
            document.getElementById('createPostForm').reset();
            
            // Reload current section
            if (currentSection === 'articles') {
                loadArticles();
            } else if (currentSection === 'announcements') {
                loadAnnouncements();
            } else if (currentSection === 'reminders') {
                loadReminders();
            }
        } else {
            showAlert(data.error || 'Failed to create post', 'danger');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        showAlert('Failed to create post. Please try again.', 'danger');
    }
}

async function voteOnPost(postId) {
    try {
        const response = await fetch(`${API_BASE}/posts/${postId}/vote`, {
            method: 'POST',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Vote recorded successfully!', 'success');
            // Reload articles to update vote counts
            if (currentSection === 'articles') {
                loadArticles();
            }
        } else {
            showAlert(data.error || 'Failed to vote', 'danger');
        }
    } catch (error) {
        console.error('Error voting:', error);
        showAlert('Failed to vote. Please try again.', 'danger');
    }
}

// UI Helper Functions
function createPostCard(post, showVoting) {
    const canVote = showVoting && post.user_has_voted !== undefined && currentUser && currentUser.can_vote !== false;
    const hasVoted = post.user_has_voted;
    const voteCount = post.vote_count || 0;
    
    return `
        <div class="card post-card mb-3">
            <div class="card-body">
                <div class="post-meta">
                    <span class="badge grade-badge">${post.grade_level.toUpperCase()}</span>
                    <span class="badge bg-info">${post.post_type}</span>
                    <small class="text-muted ms-2">
                        By ${post.author_name} • ${new Date(post.created_at).toLocaleDateString()}
                    </small>
                </div>
                <h5 class="post-title">${post.title}</h5>
                <div class="post-content">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
                ${showVoting ? `
                    <div class="post-actions">
                        <div>
                            <span class="text-muted">
                                <i class="fas fa-thumbs-up me-1"></i>
                                ${voteCount} vote${voteCount !== 1 ? 's' : ''} this month
                            </span>
                        </div>
                        ${canVote ? `
                            <button class="btn vote-btn ${hasVoted ? 'disabled' : ''}" 
                                    onclick="voteOnPost(${post.id})" 
                                    ${hasVoted ? 'disabled' : ''}>
                                <i class="fas fa-thumbs-up me-1"></i>
                                ${hasVoted ? 'Voted' : 'Vote'}
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';
    currentSection = section;
    
    // Load content based on section
    if (!currentUser && section !== 'home') {
        showAlert('Please login to access this section', 'warning');
        return;
    }
    
    switch (section) {
        case 'home':
            if (currentUser) {
                loadHomeContent();
            }
            break;
        case 'articles':
            loadArticles();
            break;
        case 'announcements':
            loadAnnouncements();
            break;
        case 'reminders':
            loadReminders();
            break;
        case 'admin':
            loadAdminContent();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

function loadProfile() {
    if (!currentUser) return;
    
    document.getElementById('profile-content').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5>Personal Information</h5>
                <p><strong>Name:</strong> ${currentUser.first_name} ${currentUser.last_name}</p>
                <p><strong>Username:</strong> ${currentUser.username}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Role:</strong> <span class="badge role-badge">${currentUser.role}</span></p>
                <p><strong>Grade Level:</strong> <span class="badge grade-badge">${currentUser.grade_level}</span></p>
                <p><strong>Member Since:</strong> ${new Date(currentUser.created_at).toLocaleDateString()}</p>
            </div>
            <div class="col-md-6">
                <h5>Account Status</h5>
                <p><strong>Status:</strong> ${currentUser.is_active ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-danger">Inactive</span>'}</p>
                <p><strong>Permissions:</strong></p>
                <ul>
                    ${currentUser.role === 'admin' ? '<li>Full administrative access</li>' : ''}
                    ${currentUser.role === 'language_teacher' ? '<li>Can create and manage posts</li>' : ''}
                    ${currentUser.role === 'teacher' ? '<li>Can view content and vote</li>' : ''}
                    ${currentUser.role === 'student' ? '<li>Can view content and vote</li>' : ''}
                    ${currentUser.role === 'parent' ? '<li>Can view content and vote</li>' : ''}
                </ul>
            </div>
        </div>
    `;
}

function showLoginModal() {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

function showRegisterModal() {
    new bootstrap.Modal(document.getElementById('registerModal')).show();
}

function showCreatePostModal(type) {
    document.getElementById('postType').value = type;
    document.getElementById('createPostTitle').textContent = `Create ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Show expiration field for announcements
    if (type === 'announcement') {
        document.getElementById('expirationDiv').style.display = 'block';
    } else {
        document.getElementById('expirationDiv').style.display = 'none';
    }
    
    new bootstrap.Modal(document.getElementById('createPostModal')).show();
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Admin Functions
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showAlert('User deleted successfully', 'success');
            loadAdminContent();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Failed to delete user', 'danger');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Failed to delete user', 'danger');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            showAlert('Post deleted successfully', 'success');
            loadAdminContent();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Failed to delete post', 'danger');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        showAlert('Failed to delete post', 'danger');
    }
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            if (activeModal.id === 'loginModal') {
                login();
            } else if (activeModal.id === 'registerModal') {
                register();
            } else if (activeModal.id === 'createPostModal') {
                createPost();
            }
        }
    }
});

