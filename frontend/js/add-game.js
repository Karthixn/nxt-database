document.addEventListener('DOMContentLoaded', () => {
    const sellPriceInput = document.getElementById('sellPrice');
    const dealerCostInput = document.getElementById('dealerCost');
    const profitPreview = document.getElementById('profitPreview');
    const form = document.getElementById('addGameSaleForm');
    const formMessage = document.getElementById('formMessage');

    // Image Preview logic
    const transactionImage = document.getElementById('transactionImage');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');

    transactionImage.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
        }
    });

    // Profit Auto-calc
    function calculateProfit() {
        const sell = parseFloat(sellPriceInput.value) || 0;
        const cost = parseFloat(dealerCostInput.value) || 0;
        profitPreview.textContent = formatCurrency(sell - cost);
    }

    sellPriceInput.addEventListener('input', calculateProfit);
    dealerCostInput.addEventListener('input', calculateProfit);

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading & Saving...';
        formMessage.textContent = '';

        const formData = new FormData(form);

        try {
            const response = await fetch(`${API_BASE_URL}/games`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: formData // DO NOT set Content-Type header manually when using FormData
            });

            if (response.ok) {
                formMessage.innerHTML = '<span class="text-success">Game sale added successfully!</span>';
                form.reset();
                profitPreview.textContent = '₹0';
                imagePreview.src = '';
                imagePreviewContainer.style.display = 'none';
            } else {
                const err = await response.json();
                formMessage.innerHTML = `<span class="text-danger">Error: ${err.message}</span>`;
            }
        } catch (error) {
            formMessage.innerHTML = `<span class="text-danger">Failed to connect to server.</span>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Game Sale';
        }
    });
});
