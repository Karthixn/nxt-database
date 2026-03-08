let allDiscordSales = [];

document.addEventListener('DOMContentLoaded', async () => {
    allDiscordSales = await fetchDiscordSales();
    renderTable(allDiscordSales);

    // Event listeners for filters
    document.getElementById('filterUsername').addEventListener('input', applyFilters);
    document.getElementById('filterItem').addEventListener('input', applyFilters);
    document.getElementById('filterPayment').addEventListener('input', applyFilters);
});

function applyFilters() {
    const userQuery = document.getElementById('filterUsername').value.toLowerCase();
    const itemQuery = document.getElementById('filterItem').value.toLowerCase();
    const paymentQuery = document.getElementById('filterPayment').value.toLowerCase();

    const filtered = allDiscordSales.filter(sale => {
        const matchUser = sale.discordUsername.toLowerCase().includes(userQuery);
        const matchItem = sale.item.toLowerCase().includes(itemQuery);
        const matchPayment = sale.paymentMethod.toLowerCase().includes(paymentQuery);
        return matchUser && matchItem && matchPayment;
    });

    renderTable(filtered);
}

function renderTable(salesData) {
    const tbody = document.getElementById('discordSalesTableBody');
    tbody.innerHTML = '';

    if (salesData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No records found</td></tr>';
        return;
    }

    salesData.forEach(sale => {
        const tr = document.createElement('tr');
        const warrantyText = sale.warrantyAvailable ? `Yes (${sale.warrantyDays}d)` : 'No';
        const viewProofBtn = sale.transactionImage ? `<a href="#" onclick="viewImage('${sale.transactionImage}'); return false;" style="color: var(--accent-color);">View</a>` : '-';

        tr.innerHTML = `
            <td>${formatDate(sale.createdAt)}</td>
            <td><strong>${sale.discordUsername}</strong><br><small class="text-muted">${sale.discordId}</small></td>
            <td>${sale.item}</td>
            <td>${formatCurrency(sale.sellPrice)}</td>
            <td>${formatCurrency(sale.dealerCost)}</td>
            <td class="text-success" style="font-weight: 600;">${formatCurrency(sale.profit)}</td>
            <td>${sale.dealerName}</td>
            <td>${warrantyText}</td>
            <td>${sale.paymentMethod}</td>
            <td>${viewProofBtn}</td>
            <td>
                <button onclick="openEditModal('${sale._id}', ${sale.sellPrice}, ${sale.dealerCost})" style="background: none; border: none; color: var(--accent-color); cursor: pointer; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteDiscordSale('${sale._id}')" style="background: none; border: none; color: var(--danger); cursor: pointer;">Delete</button>
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

// Actions logic
window.deleteDiscordSale = async function (id) {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/discord/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.ok) {
            allDiscordSales = allDiscordSales.filter(s => s._id !== id);
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
        const response = await fetch(`${API_BASE_URL}/discord/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify({ sellPrice, dealerCost })
        });

        if (response.ok) {
            const updated = await response.json();
            const index = allDiscordSales.findIndex(s => s._id === id);
            if (index !== -1) allDiscordSales[index] = updated;
            applyFilters();
            closeEditModal();
        } else {
            alert('Failed to update.');
        }
    } catch (e) { console.error(e); }
}
