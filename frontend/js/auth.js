// This script runs on all protected pages to enforce authentication
(function checkAuth() {
    const token = localStorage.getItem('nxt_token');

    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }

    // Attach token to all outgoing API calls by overloading the global fetch
    // Or we can just build an authenticated wrapper.
    // Given the current architecture, we'll implement a logout button listener here too.
})();

function logout() {
    localStorage.removeItem('nxt_token');
    window.location.href = 'login.html';
}

function getAuthHeaders() {
    const token = localStorage.getItem('nxt_token');
    return {
        'Authorization': `Bearer ${token}`
    };
}

// Add a logout button to the sidebar dynamically if we're on a secured page
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<a href="#" onclick="logout(); return false;" style="color: var(--danger); margin-top: 2rem;">Logout</a>`;
        navLinks.appendChild(logoutLi);
    }

    // Mobile Sidebar Setup
    setupMobileSidebar();
});


function setupMobileSidebar() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const sidebar = document.querySelector('.sidebar');

    // Attach listener globally to any toggle button
    document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}
