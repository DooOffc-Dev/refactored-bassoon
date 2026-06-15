const { getAllLists } = require('../lib/listManager.js');

module.exports = {
    name: 'listdata',
    description: 'Lihat semua daftar',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const lists = getAllLists();
        
        let text = `📋 *DATA LIST*\n\n`;
        for (const [type, data] of Object.entries(lists)) {
            text += `🔹 *${type.toUpperCase()}* (${data.length})\n`;
            text += `${data.slice(0, 10).join(', ')}${data.length > 10 ? `... +${data.length - 10}` : ''}\n\n`;
        }
        
        await sock.sendMessage(chat, { text });
    }
};