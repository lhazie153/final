// Drukains Today - Static Version for Netlify
// This version uses mock data instead of API calls

// Global variables
let currentUser = null;
let currentSection = 'home';

// Mock Data
const mockData = {
    users: [
        {
            id: 1,
            username: 'admin',
            email: 'admin@drukains.edu',
            role: 'admin',
            first_name: 'System',
            last_name: 'Administrator',
            grade_level: 'senior'
        },
        {
            id: 2,
            username: 'teacher_lang',
            email: 'lang.teacher@drukains.edu',
            role: 'language_teacher',
            first_name: 'Sarah',
            last_name: 'Johnson',
            grade_level: 'senior'
        },
        {
            id: 3,
            username: 'student1',
            email: 'student1@drukains.edu',
            role: 'student',
            first_name: 'Emma',
            last_name: 'Wilson',
            grade_level: 'senior'
        }
    ],
    posts: [
        {
            id: 1,
            title: "Welcome to the New School Year!",
            content: "Dear students, parents, and faculty,\\n\\nWelcome to another exciting school year! We are thrilled to have you all back and look forward to a year filled with learning, growth, and achievement.\\n\\nThis year, we have implemented several new programs and initiatives designed to enhance your educational experience. Please stay tuned for more updates and announcements.\\n\\nBest regards,\\nDr. Principal",
            post_type: "principal_note",
            grade_level: "all",
            author_id: 1,
            author_name: "System Administrator",
            created_at: "2024-09-01T08:00:00Z",
            votes: 15
        },
        {
            id: 2,
            title: "Parent-Teacher Conference Schedule",
            content: "Parent-teacher conferences will be held next week from October 15-19. Please check your email for your scheduled appointment time. If you need to reschedule, please contact the main office.",
            post_type: "announcement",
            grade_level: "all",
            author_id: 1,
            author_name: "System Administrator",
            created_at: "2024-09-05T10:30:00Z",
            votes: 8
        },
        {
            id: 3,
            title: "Library Books Due",
            content: "Reminder: All library books are due by Friday, October 12th. Please return them to avoid late fees.",
            post_type: "reminder",
            grade_level: "all",
            author_id: 1,
            author_name: "System Administrator",
            created_at: "2024-09-06T14:15:00Z",
            votes: 5
        },
        {
            id: 4,
            title: "Science Fair Winners Announced",
            content: "Congratulations to all participants in this year's science fair! The winners have been announced and will be recognized at the next school assembly. Great work everyone!",
            post_type: "article",
            grade_level: "all",
            author_id: 2,
            author_name: "Sarah Johnson",
            created_at: "2024-09-04T16:45:00Z",
            votes: 12
        },
        {
            id: 5,
            title: "New Art Exhibition Opening",
            content: "We're excited to announce a new student art exhibition opening in the main hallway. Come see the amazing creativity of our talented students!",
            post_type: "article",
            grade_level: "all",
            author_id: 2,
            author_name: "Sarah Johnson",
            created_at: "2024-09-03T11:20:00Z",
            votes: 9
        }
    ],
    monthlyWinners: [
        {
            id: 1,
            user_id: 3,
            user_name: "Emma Wilson",
            month: "September",
            year: 2024,
            total_votes: 25
        }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // For demo purposes, we'll show the authenticated UI by default
    // In a real static site, you might want to implement localStorage-based auth
    showUnauthenticatedUI();
    hideLoading();
    showSection('home');
    loadHomeContent();
});

// Authentication Functions (Mock)
function showAuthenticatedUI() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('user-name').textContent = `${currentUser.first_name} ${currentUser.last_name}`;
    }
    
    // Show navigation items
    document.getElementById('nav-articles').style.display = 'block';
    document.getElementById('nav-announcements').style.display = 'block';
    document.getElementById('nav-reminders').style.display = 'block';
    
    // Show admin section if user is admin
    if (currentUser && currentUser.role === 'admin') {
        document.getElementById('nav-admin').style.display = 'block';
    }
    
    // Show create buttons based on role
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'language_teacher' || currentUser.role === 'teacher')) {
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
}

// Mock Login Function
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showAlert('Please enter both username and password', 'error');
        return;
    }
    
    // Mock authentication - in a real app, this would be handled by a backend
    const user = mockData.users.find(u => u.username === username);
    
    if (user && (username === 'admin' && password === 'admin123' || 
                 username === 'teacher_lang' && password === 'teacher123' ||
                 username === 'student1' && password === 'student123')) {
        currentUser = user;
        showAuthenticatedUI();
        hideModal('loginModal');
        showAlert('Login successful!', 'success');
        loadHomeContent();
    } else {
        showAlert('Invalid credentials. Try: admin/admin123, teacher_lang/teacher123, or student1/student123', 'error');
    }
}

// Mock Register Function
async function register() {
    showAlert('Registration is disabled in the static demo version. Use the demo accounts to login.', 'info');
}

// Logout Function
function logout() {
    currentUser = null;
    showUnauthenticatedUI();
    showSection('home');
    showAlert('Logged out successfully', 'success');
    loadHomeContent();
}

// Content Loading Functions
function loadHomeContent() {
    loadPrincipalNote();
    loadRecentNews();
    loadImportantReminders();
    loadMonthlyWinners();
}

function loadPrincipalNote() {
    const principalNote = mockData.posts.find(p => p.post_type === 'principal_note');
    const container = document.getElementById('principal-note');
    
    if (principalNote) {
        container.innerHTML = `
            <h6 class="card-title">${principalNote.title}</h6>
            <p class="card-text">${principalNote.content.replace(/\\n/g, '<br>')}</p>
            <small class="text-muted">Posted on ${new Date(principalNote.created_at).toLocaleDateString()}</small>
        `;
    } else {
        container.innerHTML = '<p class="text-muted">No principal note available.</p>';
    }
}

function loadRecentNews() {
    const articles = mockData.posts.filter(p => p.post_type === 'article').slice(0, 3);
    const container = document.getElementById('recent-news');
    
    if (articles.length > 0) {
        container.innerHTML = articles.map(article => `
            <div class="mb-3 pb-3 border-bottom">
                <h6 class="card-title">${article.title}</h6>
                <p class="card-text">${article.content.substring(0, 150)}...</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">By ${article.author_name}</small>
                    <small class="text-muted">${new Date(article.created_at).toLocaleDateString()}</small>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-muted">No recent news available.</p>';
    }
}

function loadImportantReminders() {
    const reminders = mockData.posts.filter(p => p.post_type === 'reminder').slice(0, 3);
    const container = document.getElementById('important-reminders');
    
    if (reminders.length > 0) {
        container.innerHTML = reminders.map(reminder => `
            <div class="alert alert-warning mb-2" role="alert">
                <strong>${reminder.title}</strong><br>
                <small>${reminder.content}</small>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-muted">No important reminders.</p>';
    }
}

function loadMonthlyWinners() {
    const winners = mockData.monthlyWinners;
    const container = document.getElementById('monthly-winners');
    const card = document.getElementById('winners-card');
    
    if (winners.length > 0) {
        card.style.display = 'block';
        container.innerHTML = winners.map(winner => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span><strong>${winner.user_name}</strong></span>
                <span class="badge bg-success">${winner.total_votes} votes</span>
            </div>
        `).join('');
    } else {
        card.style.display = 'none';
    }
}

// Section Management
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
        currentSection = sectionName;
        
        // Load content based on section
        switch(sectionName) {
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
                if (currentUser && currentUser.role === 'admin') {
                    loadAdminDashboard();
                } else {
                    showAlert('Access denied. Admin privileges required.', 'error');
                    showSection('home');
                }
                break;
            case 'profile':
                if (currentUser) {
                    loadProfile();
                } else {
                    showAlert('Please login to view your profile.', 'error');
                    showSection('home');
                }
                break;
        }
    }
}

function loadArticles() {
    const articles = mockData.posts.filter(p => p.post_type === 'article');
    const topArticles = [...articles].sort((a, b) => b.votes - a.votes).slice(0, 3);
    
    // Load top articles
    const topContainer = document.getElementById('top-articles');
    if (topArticles.length > 0) {
        topContainer.innerHTML = topArticles.map(article => `
            <div class="mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="card-title">${article.title}</h6>
                        <p class="card-text">${article.content}</p>
                        <small class="text-muted">By ${article.author_name} on ${new Date(article.created_at).toLocaleDateString()}</small>
                    </div>
                    <div class="ms-3 text-center">
                        <span class="badge bg-primary">${article.votes} votes</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        topContainer.innerHTML = '<p class="text-muted">No articles available.</p>';
    }
    
    // Load all articles
    const allContainer = document.getElementById('all-articles');
    if (articles.length > 0) {
        allContainer.innerHTML = articles.map(article => `
            <div class="mb-3 pb-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="card-title">${article.title}</h6>
                        <p class="card-text">${article.content}</p>
                        <small class="text-muted">By ${article.author_name} on ${new Date(article.created_at).toLocaleDateString()}</small>
                    </div>
                    <div class="ms-3 text-center">
                        <button class="btn btn-sm btn-outline-primary" onclick="votePost(${article.id})">
                            <i class="fas fa-thumbs-up"></i> ${article.votes}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        allContainer.innerHTML = '<p class="text-muted">No articles available.</p>';
    }
}

function loadAnnouncements() {
    const announcements = mockData.posts.filter(p => p.post_type === 'announcement');
    const container = document.getElementById('announcements-content');
    
    if (announcements.length > 0) {
        container.innerHTML = announcements.map(announcement => `
            <div class="alert alert-info mb-3" role="alert">
                <h6 class="alert-heading">${announcement.title}</h6>
                <p class="mb-2">${announcement.content}</p>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="mb-0">By ${announcement.author_name} on ${new Date(announcement.created_at).toLocaleDateString()}</small>
                    <button class="btn btn-sm btn-outline-primary" onclick="votePost(${announcement.id})">
                        <i class="fas fa-thumbs-up"></i> ${announcement.votes}
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-muted">No announcements available.</p>';
    }
}

function loadReminders() {
    const reminders = mockData.posts.filter(p => p.post_type === 'reminder');
    const container = document.getElementById('reminders-content');
    
    if (reminders.length > 0) {
        container.innerHTML = reminders.map(reminder => `
            <div class="alert alert-warning mb-3" role="alert">
                <h6 class="alert-heading">${reminder.title}</h6>
                <p class="mb-2">${reminder.content}</p>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="mb-0">By ${reminder.author_name} on ${new Date(reminder.created_at).toLocaleDateString()}</small>
                    <button class="btn btn-sm btn-outline-primary" onclick="votePost(${reminder.id})">
                        <i class="fas fa-thumbs-up"></i> ${reminder.votes}
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="text-muted">No reminders available.</p>';
    }
}

function loadAdminDashboard() {
    // Load statistics
    document.getElementById('total-users').textContent = mockData.users.length;
    document.getElementById('total-posts').textContent = mockData.posts.length;
    document.getElementById('total-votes').textContent = mockData.posts.reduce((sum, post) => sum + post.votes, 0);
    document.getElementById('active-users').textContent = mockData.users.filter(u => u.role !== 'admin').length;
    
    // Load user management
    const userContainer = document.getElementById('user-management');
    userContainer.innerHTML = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.users.map(user => `
                        <tr>
                            <td>${user.first_name} ${user.last_name}</td>
                            <td><span class="badge bg-secondary">${user.role}</span></td>
                            <td>${user.grade_level}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Load content management
    const contentContainer = document.getElementById('content-management');
    contentContainer.innerHTML = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Votes</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.posts.map(post => `
                        <tr>
                            <td>${post.title.substring(0, 30)}...</td>
                            <td><span class="badge bg-info">${post.post_type}</span></td>
                            <td>${post.votes}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function loadProfile() {
    const container = document.getElementById('profile-content');
    if (currentUser) {
        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h5>Personal Information</h5>
                    <p><strong>Name:</strong> ${currentUser.first_name} ${currentUser.last_name}</p>
                    <p><strong>Username:</strong> ${currentUser.username}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Role:</strong> <span class="badge bg-primary">${currentUser.role}</span></p>
                    <p><strong>Grade Level:</strong> ${currentUser.grade_level}</p>
                </div>
                <div class="col-md-6">
                    <h5>Activity Summary</h5>
                    <p><strong>Posts Created:</strong> ${mockData.posts.filter(p => p.author_id === currentUser.id).length}</p>
                    <p><strong>Total Votes Received:</strong> ${mockData.posts.filter(p => p.author_id === currentUser.id).reduce((sum, post) => sum + post.votes, 0)}</p>
                </div>
            </div>
        `;
    }
}

// Utility Functions
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

function showCreatePostModal(type) {
    showAlert(`Create ${type} functionality is disabled in the static demo version.`, 'info');
}

function votePost(postId) {
    if (!currentUser) {
        showAlert('Please login to vote on posts.', 'error');
        return;
    }
    
    // Find and increment vote count
    const post = mockData.posts.find(p => p.id === postId);
    if (post) {
        post.votes++;
        showAlert('Vote recorded!', 'success');
        
        // Refresh current section
        showSection(currentSection);
    }
}

// Handle form submissions
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (e.target.closest('#loginModal')) {
            login();
        }
    }
});

