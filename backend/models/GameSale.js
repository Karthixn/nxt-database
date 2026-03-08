const mongoose = require('mongoose');

const gameSaleSchema = new mongoose.Schema({
    buyerDiscordId: { type: String, required: true },
    gameName: { type: String, required: true },
    sellPrice: { type: Number, required: true },
    dealerCost: { type: Number, required: true },
    profit: { type: Number },
    dealerName: { type: String, required: true },
    warrantyAvailable: { type: Boolean, default: false },
    warrantyDays: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    transactionImage: { type: String, required: true }, // File path to the uploaded image
    gameId: { type: String, required: true },
    gamePassword: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Auto calculate profit before saving
gameSaleSchema.pre('save', function (next) {
    this.profit = this.sellPrice - this.dealerCost;
    next();
});

module.exports = mongoose.model('GameSale', gameSaleSchema);
