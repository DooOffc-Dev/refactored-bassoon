const { setWelcome, getWelcome } = require('../lib/groupHandler.js');

module.exports = {
    name: 'setwelcome',
    description: 'Set pesan welcome untuk grup (bisa pake foto)',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const isGroup = chat.endsWith('@g.us');
        if (!isGroup) {
            await sock.sendMessage(chat, { text: '❌ Command ini hanya untuk grup!' });
            return;
        }
        
        if (args.length === 0) {
            const current = getWelcome(chat);
            await sock.sendMessage(chat, { 
                text: `📝 *SET WELCOME*\n\nFormat: ${config.prefix}setwelcome [teks] | [url_foto]\nPlaceholder: @user, @grup\n\nStatus: ${current ? 'Aktif' : 'Tidak aktif'}` 
            });
            return;
        }
        
        const fullText = args.join(' ');
        let text = fullText;
        let imageUrl = null;
        
        if (fullText.includes('|')) {
            const parts = fullText.split('|');
            text = parts[0].trim();
            imageUrl = parts[1].trim();
        }
        
        setWelcome(chat, text, imageUrl);
        await sock.sendMessage(chat, { text: `✅ Welcome berhasil diset!` });
    }
};
