const sendDiscordWebhook = async (saleType, data) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    let messageContent = '';

    if (saleType === 'Discord') {
        messageContent = `💬 **Discord Sale**\n\n**User:** ${data.discordUsername}\n**Item:** ${data.item}\n\n**Price:** ₹${data.sellPrice}\n**Dealer Cost:** ₹${data.dealerCost}\n**Profit:** ₹${data.profit}\n\n**Dealer:** ${data.dealerName}\n**Warranty:** ${data.warrantyAvailable ? `Yes (${data.warrantyDays} Days)` : 'No'}\n\n**Payment:** ${data.paymentMethod}`;
    } else if (saleType === 'Game') {
        messageContent = `🎮 **Game Sale**\n\n**Buyer:** ${data.buyerDiscordId}\n**Game:** ${data.gameName}\n\n**Price:** ₹${data.sellPrice}\n**Dealer Cost:** ₹${data.dealerCost}\n**Profit:** ₹${data.profit}\n\n**Dealer:** ${data.dealerName}\n\n**Warranty:** ${data.warrantyAvailable ? `Yes (${data.warrantyDays} Days)` : 'No'}\n\n**Payment:** ${data.paymentMethod}`;
    }

    const payload = {
        content: messageContent,
    };

    if (!webhookUrl) {
        console.log('--- Webhook Not Configured ---');
        console.log(payload.content);
        console.log('------------------------------');
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Failed to send Discord webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending webhook:', error);
    }
};

module.exports = sendDiscordWebhook;
