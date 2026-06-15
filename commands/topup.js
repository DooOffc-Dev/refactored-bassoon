const fs = require('fs');

module.exports = {
    name: 'topup',
    description: 'Topup limit (owner)',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        if (args.length < 2) {
            await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}topup [nomor] [jumlah]` });
            return;
        }
        
        let target = args[0].replace(/[^0-9]/g, '');
        const amount = parseInt(args[1]);
        
        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(chat, { text: '❌ Jumlah tidak valid!' });
            return;
        }
        
        let limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
        limitDB[target] = (limitDB[target] || 0) + amount;
        fs.writeFileSync('./database/limit.json', JSON.stringify(limitDB, null, 2));
        
        await sock.sendMessage(chat, { text: `✅ Topup ${amount} limit ke ${target} berhasil!` });
        
        try {
            await sock.sendMessage(`${target}@s.whatsapp.net`, {
                text: `🎉 *TOPUP BERHASIL!*\n\nKamu mendapat +${amount} limit!\n📊 Total limit: ${limitDB[target]}`
            });
        } catch (err) {}
    }
};