module.exports = {
    name: 'payment',
    description: 'Lihat metode pembayaran',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const sub = args[0]?.toLowerCase();
        
        if (sub === 'qris') {
            await sock.sendMessage(chat, {
                image: { url: config.paymentMethods.qris },
                caption: `💳 *PAYMENT QRIS*\n\n💰 Harga: Rp${config.topupPrice.toLocaleString()}\n🎁 Dapat: ${config.topupLimit} Limit\n\n📌 Kirim bukti ke wa.me/${config.ownerNumber}`
            });
            return;
        }
        
        const text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💰 *METODE PEMBAYARAN* 💰
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*QRIS* - Ketik: ${config.prefix}payment qris
*DANA* - ${config.paymentMethods.dana}
*OVO* - ${config.paymentMethods.ovo}
*GOPAY* - ${config.paymentMethods.gopay}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Harga: Rp${config.topupPrice.toLocaleString()}
🎁 Dapat: ${config.topupLimit} Limit

📌 Transfer > Screenshot > Kirim ke owner
👑 wa.me/${config.ownerNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await sock.sendMessage(chat, { text });
    }
};