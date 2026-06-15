const { removeFromList } = require('../lib/listManager.js');

module.exports = {
    name: 'delist',
    description: 'Hapus dari daftar',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        if (args.length < 2) {
            await sock.sendMessage(chat, { 
                text: `❌ Format: ${config.prefix}delist [type] [nomor]\nContoh: ${config.prefix}delist blacklist 6281234567890` 
            });
            return;
        }
        
        const type = args[0].toLowerCase();
        let target = args[1].replace(/[^0-9]/g, '');
        
        if (!target) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (mentioned) target = mentioned.split('@')[0];
        }
        
        if (removeFromList(type, target)) {
            await sock.sendMessage(chat, { text: `✅ ${target} dihapus dari *${type}*!` });
        } else {
            await sock.sendMessage(chat, { text: `⚠️ ${target} tidak ditemukan!` });
        }
    }
};