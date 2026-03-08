document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');
    const API_BASE_URL = 'http://localhost:5000/api';

    // If already logged in, redirect to dashboard
    if (localStorage.getItem('nxt_token')) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
        message.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('nxt_token', data.token);
                window.location.href = 'index.html';
            } else {
                message.innerHTML = '<span class="text-danger">Invalid password.</span>';
            }
        } catch (error) {
            message.innerHTML = '<span class="text-danger">Network error connecting to server.</span>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
});
