const fs = require('fs');

module.exports = {
    name: 'limit',
    description: 'Cek sisa limit',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        let limitDB = {};
        if (fs.existsSync('./database/limit.json')) {
            limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
        }
        
        const limit = limitDB[sender] || config.defaultLimit;
        await sock.sendMessage(chat, { text: `📊 Sisa limit kamu: *${limit}*` });
    }
};