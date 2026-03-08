document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Data
    const [discordSales, gameSales] = await Promise.all([
        fetchDiscordSales(),
        fetchGameSales()
    ]);

    const allSales = [...discordSales, ...gameSales];

    // Chart.js Default styling for dark mode
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = '#334155';

    // 2. Data Processing
    renderRevenueProfitChart(allSales);
    renderCompareChart(discordSales, gameSales);
    renderPaymentMethodsChart(allSales);
    renderDealersChart(allSales);
});

function renderRevenueProfitChart(sales) {
    const dateMap = {};
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        last7Days.push(dateStr);
        dateMap[dateStr] = { revenue: 0, profit: 0 };
    }

    sales.forEach(s => {
        const dStr = new Date(s.createdAt).toISOString().split('T')[0];
        if (dateMap[dStr]) {
            dateMap[dStr].revenue += s.sellPrice;
            dateMap[dStr].profit += s.profit;
        }
    });

    const ctx = document.getElementById('profitPerDayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last7Days,
            datasets: [
                {
                    label: 'Revenue (₹)',
                    data: last7Days.map(d => dateMap[d].revenue),
                    backgroundColor: 'rgba(0, 229, 255, 0.6)',
                    borderColor: '#00e5ff',
                    borderWidth: 1
                },
                {
                    label: 'Profit (₹)',
                    data: last7Days.map(d => dateMap[d].profit),
                    backgroundColor: 'rgba(255, 0, 234, 0.6)',
                    borderColor: '#ff00ea',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderCompareChart(discord, games) {
    const discordRev = discord.reduce((sum, s) => sum + s.sellPrice, 0);
    const gamesRev = games.reduce((sum, s) => sum + s.sellPrice, 0);

    const ctx = document.getElementById('discordVsGameChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Discord Sales', 'Game Sales'],
            datasets: [{
                data: [discordRev, gamesRev],
                backgroundColor: ['#00e5ff', '#ff00ea'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%'
        }
    });
}

function renderPaymentMethodsChart(sales) {
    const map = {};
    sales.forEach(s => {
        const method = s.paymentMethod || 'Unknown';
        map[method] = (map[method] || 0) + 1;
    });

    const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(map),
            datasets: [{
                data: Object.values(map),
                backgroundColor: ['#00e5ff', '#ff00ea', '#A020F0', '#00f', '#00ff00'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderDealersChart(sales) {
    const map = {};
    sales.forEach(s => {
        const dealer = s.dealerName || 'Unknown';
        map[dealer] = (map[dealer] || 0) + 1;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const ctx = document.getElementById('dealersChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(k => k[0]),
            datasets: [{
                label: 'Total Sales Count',
                data: sorted.map(k => k[1]),
                backgroundColor: '#00e5ff',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { beginAtZero: true } }
        }
    });
}
