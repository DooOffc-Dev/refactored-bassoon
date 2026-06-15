const { addToList, getList } = require('../lib/listManager.js');

module.exports = {
    name: 'addlist',
    description: 'Tambah ke daftar (blacklist/whitelist/admin/premium)',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        if (args.length < 2) {
            await sock.sendMessage(chat, { 
                text: `📝 *ADD LIST*\n\nFormat: ${config.prefix}addlist [type] [nomor]\nType: blacklist, whitelist, admin, premium` 
            });
            return;
        }
        
        const type = args[0].toLowerCase();
        let target = args[1].replace(/[^0-9]/g, '');
        
        if (!config.listTypes.includes(type)) {
            await sock.sendMessage(chat, { text: `❌ Type tidak valid! Pilih: ${config.listTypes.join(', ')}` });
            return;
        }
        
        if (!target) {
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            if (mentioned) target = mentioned.split('@')[0];
        }
        
        if (!target) {
            await sock.sendMessage(chat, { text: '❌ Masukkan nomor atau tag user!' });
            return;
        }
        
        if (addToList(type, target)) {
            await sock.sendMessage(chat, { text: `✅ ${target} ditambahkan ke *${type}*!` });
        } else {
            await sock.sendMessage(chat, { text: `⚠️ ${target} sudah ada!` });
        }
    }
};