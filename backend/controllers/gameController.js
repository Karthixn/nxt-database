const GameSale = require('../models/GameSale');
const sendDiscordWebhook = require('../webhookLogger');

const getGameSales = async (req, res) => {
    try {
        const sales = await GameSale.find().sort({ createdAt: -1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const createGameSale = async (req, res) => {
    try {
        const saleData = Object.assign({}, req.body);

        // Handle boolean and number conversion from FormData
        saleData.warrantyAvailable = saleData.warrantyAvailable === true || saleData.warrantyAvailable === 'true';
        saleData.sellPrice = Number(saleData.sellPrice);
        saleData.dealerCost = Number(saleData.dealerCost);
        saleData.warrantyDays = Number(saleData.warrantyDays) || 0;

        if (req.file) {
            saleData.transactionImage = `/uploads/transactions/${req.file.filename}`;
        } else {
            return res.status(400).json({ message: 'Transaction image is required' });
        }

        const newSale = new GameSale(saleData);
        const savedSale = await newSale.save();

        // Asynchronously log to Discord
        sendDiscordWebhook('Game', savedSale);

        res.status(201).json(savedSale);
    } catch (error) {
        console.error('Error creating Game Sale:', error);
        res.status(400).json({ message: 'Bad Request', error: error.message });
    }
};

const updateGameSale = async (req, res) => {
    try {
        const saleData = Object.assign({}, req.body);
        if (saleData.warrantyAvailable) saleData.warrantyAvailable = saleData.warrantyAvailable === true || saleData.warrantyAvailable === 'true';
        if (saleData.sellPrice) saleData.sellPrice = Number(saleData.sellPrice);
        if (saleData.dealerCost) saleData.dealerCost = Number(saleData.dealerCost);
        if (saleData.warrantyDays) saleData.warrantyDays = Number(saleData.warrantyDays);

        if (saleData.sellPrice && saleData.dealerCost) {
            saleData.profit = saleData.sellPrice - saleData.dealerCost;
        }

        const updatedSale = await GameSale.findByIdAndUpdate(req.params.id, saleData, { new: true });
        res.status(200).json(updatedSale);
    } catch (error) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

const deleteGameSale = async (req, res) => {
    try {
        await GameSale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    getGameSales,
    createGameSale,
    updateGameSale,
    deleteGameSale
};
