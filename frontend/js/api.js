// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all Discord Sales
async function fetchDiscordSales() {
    try {
        const response = await fetch(`${API_BASE_URL}/discord`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401) logout();
        if (!response.ok) throw new Error('Failed to fetch Discord sales');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Fetch all Game Sales
async function fetchGameSales() {
    try {
        const response = await fetch(`${API_BASE_URL}/games`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401) logout();
        if (!response.ok) throw new Error('Failed to fetch Game sales');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Format Currency
function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}
