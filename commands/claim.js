const fs = require('fs');

module.exports = {
    name: 'claim',
    description: 'Klaim limit harian',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        let limitDB = {};
        if (fs.existsSync('./database/limit.json')) {
            limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
        }
        
        const lastClaim = limitDB[`${sender}_last_claim`] || 0;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        if (now - lastClaim < oneDay) {
            const remaining = Math.ceil((oneDay - (now - lastClaim)) / (60 * 60 * 1000));
            await sock.sendMessage(chat, { text: `⚠️ Kamu sudah claim hari ini! Coba lagi dalam ${remaining} jam.` });
            return;
        }
        
        limitDB[sender] = (limitDB[sender] || 0) + config.defaultLimit;
        limitDB[`${sender}_last_claim`] = now;
        fs.writeFileSync('./database/limit.json', JSON.stringify(limitDB, null, 2));
        
        await sock.sendMessage(chat, { text: `✅ Kamu mendapat ${config.defaultLimit} limit!` });
    }
};