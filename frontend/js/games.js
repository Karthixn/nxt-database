let allGameSales = [];

document.addEventListener('DOMContentLoaded', async () => {
    allGameSales = await fetchGameSales();
    renderTable(allGameSales);

    document.getElementById('filterBuyer').addEventListener('input', applyFilters);
    document.getElementById('filterGame').addEventListener('input', applyFilters);
});

function applyFilters() {
    const buyerQuery = document.getElementById('filterBuyer').value.toLowerCase();
    const gameQuery = document.getElementById('filterGame').value.toLowerCase();

    const filtered = allGameSales.filter(sale => {
        const matchBuyer = sale.buyerDiscordId.toLowerCase().includes(buyerQuery);
        const matchGame = sale.gameName.toLowerCase().includes(gameQuery);
        return matchBuyer && matchGame;
    });

    renderTable(filtered);
}

function renderTable(salesData) {
    const tbody = document.getElementById('gameSalesTableBody');
    tbody.innerHTML = '';

    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;">No records found</td></tr>';
        return;
    }

    salesData.forEach(sale => {
        const tr = document.createElement('tr');
        const warrantyText = sale.warrantyAvailable ? `Yes (${sale.warrantyDays}d)` : 'No';

        // Use a placeholder if image doesn't load/exist
        const viewProofBtn = sale.transactionImage ? `<a href="#" onclick="viewImage('${sale.transactionImage}'); return false;" style="color: var(--accent-color);">View</a>` : '-';
        const viewCredsBtn = `<a href="#" onclick="viewCredentials('${sale.gameId}', '${sale.gamePassword}'); return false;" style="color: var(--accent-color);">Show</a>`;

        tr.innerHTML = `
            <td>${formatDate(sale.createdAt)}</td>
            <td><strong>${sale.buyerDiscordId}</strong></td>
            <td>${sale.gameName}</td>
            <td>${formatCurrency(sale.sellPrice)}</td>
            <td>${formatCurrency(sale.dealerCost)}</td>
            <td class="text-success" style="font-weight: 600;">${formatCurrency(sale.profit)}</td>
            <td>${sale.dealerName}</td>
            <td>${warrantyText}</td>
            <td>${sale.paymentMethod}</td>
            <td>${viewCredsBtn}</td>
            <td>${viewProofBtn}</td>
            <td>
                <button onclick="openEditModal('${sale._id}', ${sale.sellPrice}, ${sale.dealerCost})" style="background: none; border: none; color: var(--accent-color); cursor: pointer; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteGameSale('${sale._id}')" style="background: none; border: none; color: var(--danger); cursor: pointer;">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.viewImage = function (imgUrl) {
    document.getElementById('modalImage').src = imgUrl;
    document.getElementById('imageModal').classList.add('active');
}

window.closeModal = function (e) {
    if (!e || e.target.id === 'imageModal') {
        document.getElementById('imageModal').classList.remove('active');
    }
}

window.viewCredentials = function (gameId, password) {
    document.getElementById('modalGameId').textContent = gameId;
    document.getElementById('modalGamePassword').textContent = password;
    document.getElementById('credentialsModal').classList.add('active');
}

// Actions logic
window.deleteGameSale = async function (id) {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) {
            allGameSales = allGameSales.filter(s => s._id !== id);
            applyFilters();
        } else {
            alert('Failed to delete.');
        }
    } catch (e) { console.error(e); }
}

window.openEditModal = function (id, price, cost) {
    document.getElementById('editSaleId').value = id;
    document.getElementById('editSellPrice').value = price;
    document.getElementById('editDealerCost').value = cost;
    document.getElementById('editModal').classList.add('active');
}

window.closeEditModal = function (e) {
    if (!e || e.target.id === 'editModal' || e === undefined) {
        document.getElementById('editModal').classList.remove('active');
    }
}

window.saveEditSale = async function () {
    const id = document.getElementById('editSaleId').value;
    const sellPrice = document.getElementById('editSellPrice').value;
    const dealerCost = document.getElementById('editDealerCost').value;

    try {
        const response = await fetch(`${API_BASE_URL}/games/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ sellPrice, dealerCost })
        });

        if (response.ok) {
            const updated = await response.json();
            const index = allGameSales.findIndex(s => s._id === id);
            if (index !== -1) allGameSales[index] = updated;
            applyFilters();
            closeEditModal();
        } else {
            alert('Failed to update.');
        }
    } catch (e) { console.error(e); }
}

window.closeCredsModal = function (e) {
    if (!e || e.target.id === 'credentialsModal' || e === undefined) {
        document.getElementById('credentialsModal').classList.remove('active');
    }
}
