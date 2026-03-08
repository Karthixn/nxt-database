const mongoose = require('mongoose');

const discordSaleSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    discordUsername: { type: String, required: true },
    item: { type: String, required: true },
    sellPrice: { type: Number, required: true },
    dealerCost: { type: Number, required: true },
    profit: { type: Number },
    dealerName: { type: String, required: true },
    warrantyAvailable: { type: Boolean, default: false },
    warrantyDays: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    transactionImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Auto calculate profit before saving
discordSaleSchema.pre('save', function (next) {
    this.profit = this.sellPrice - this.dealerCost;
    next();
});

module.exports = mongoose.model('DiscordSale', discordSaleSchema);
