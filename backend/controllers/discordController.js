const DiscordSale = require('../models/DiscordSale');
const sendDiscordWebhook = require('../webhookLogger');

const getDiscordSales = async (req, res) => {
    try {
        const sales = await DiscordSale.find().sort({ createdAt: -1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createDiscordSale = async (req, res) => {
    try {
        const saleData = Object.assign({}, req.body);

        // Handle type coercions just in case
        saleData.warrantyAvailable = saleData.warrantyAvailable === true || saleData.warrantyAvailable === 'true';
        saleData.sellPrice = Number(saleData.sellPrice);
        saleData.dealerCost = Number(saleData.dealerCost);
        saleData.warrantyDays = Number(saleData.warrantyDays) || 0;

        if (req.file) {
            saleData.transactionImage = `/uploads/transactions/${req.file.filename}`;
        }

        const newSale = new DiscordSale(saleData);
        const savedSale = await newSale.save();

        // Asynchronously log to Discord
        sendDiscordWebhook('Discord', savedSale);

        res.status(201).json(savedSale);
    } catch (error) {
        console.error('Error creating Discord Sale:', error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
};

const updateDiscordSale = async (req, res) => {
    try {
        const saleData = Object.assign({}, req.body);
        if (saleData.warrantyAvailable) saleData.warrantyAvailable = saleData.warrantyAvailable === true || saleData.warrantyAvailable === 'true';
        if (saleData.sellPrice) saleData.sellPrice = Number(saleData.sellPrice);
        if (saleData.dealerCost) saleData.dealerCost = Number(saleData.dealerCost);
        if (saleData.warrantyDays) saleData.warrantyDays = Number(saleData.warrantyDays);

        // Ensure profit recalculates via pre-save hook by using findById and save, OR just calculate it here
        if (saleData.sellPrice && saleData.dealerCost) {
            saleData.profit = saleData.sellPrice - saleData.dealerCost;
        }

        const updatedSale = await DiscordSale.findByIdAndUpdate(req.params.id, saleData, { new: true });
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

const deleteDiscordSale = async (req, res) => {
    try {
        await DiscordSale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    getDiscordSales,
    createDiscordSale,
    updateDiscordSale,
    deleteDiscordSale
};
