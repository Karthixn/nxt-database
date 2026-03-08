document.addEventListener('DOMContentLoaded', async () => {
    // Fetch data
    const [discordSales, gameSales] = await Promise.all([
        fetchDiscordSales(),
        fetchGameSales()
    ]);

    // Calculate Totals
    let totalRevenue = 0;
    let totalProfit = 0;

    discordSales.forEach(sale => {
        totalRevenue += sale.sellPrice;
        totalProfit += sale.profit;
    });

    gameSales.forEach(sale => {
        totalRevenue += sale.sellPrice;
        totalProfit += sale.profit;
    });

    // Update Cards
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalProfit').textContent = formatCurrency(totalProfit);
    document.getElementById('discordCount').textContent = discordSales.length;
    document.getElementById('gameCount').textContent = gameSales.length;

    // Merge and sort recent sales
    const allSales = [
        ...discordSales.map(s => ({ ...s, type: 'Discord', name: s.item })),
        ...gameSales.map(s => ({ ...s, type: 'Game', name: s.gameName }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    // Render Table
    const tbody = document.getElementById('recentSalesTableBody');
    tbody.innerHTML = '';

    if (allSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No recent sales found</td></tr>';
        return;
    }

    allSales.forEach(sale => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="color: ${sale.type === 'Discord' ? '#00e5ff' : '#ff00ea'}; font-weight: 600;">${sale.type}</span></td>
            <td>${sale.name}</td>
            <td>${formatCurrency(sale.sellPrice)}</td>
            <td class="text-success">${formatCurrency(sale.profit)}</td>
            <td>${sale.dealerName}</td>
            <td>${formatDate(sale.createdAt)}</td>
        `;
        tbody.appendChild(tr);
    });
});
