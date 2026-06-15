const { manualBackup } = require('../lib/backupManager.js');

module.exports = {
    name: 'backup',
    description: 'Backup semua script bot dan kirim ke owner',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        await sock.sendMessage(chat, { text: '🔄 *Creating backup...* Mohon tunggu sebentar bos!' });
        
        const success = await manualBackup(sock, config, chat);
        
        if (!success) {
            await sock.sendMessage(chat, { text: '❌ Backup gagal! Cek log error.' });
        }
    }
};