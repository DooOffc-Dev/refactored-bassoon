const fs = require('fs');

module.exports = {
    name: 'setbackup',
    description: 'Setting auto backup (on/off) dan interval',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💾 *SET AUTO BACKUP* 💾
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Status:* ${config.autoBackup ? '🟢 ON' : '🔴 OFF'}
*Interval:* ${config.backupInterval} jam sekali

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Perintah:*

${config.prefix}setbackup on - Aktifkan auto backup
${config.prefix}setbackup off - Matikan auto backup
${config.prefix}setbackup interval [jam] - Ganti interval

*Contoh:*
${config.prefix}setbackup interval 12 (backup tiap 12 jam)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Backup akan dikirim otomatis ke owner
📁 Isi backup: index.js, config.js, commands/, lib/, plugins/
━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        // ON
        if (subCommand === 'on') {
            config.autoBackup = true;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/autoBackup: (true|false)/, `autoBackup: true`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ *Auto Backup DIAKTIFKAN!*\n\nBot akan mengirim backup setiap ${config.backupInterval} jam ke owner.` });
            return;
        }
        
        // OFF
        if (subCommand === 'off') {
            config.autoBackup = false;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/autoBackup: (true|false)/, `autoBackup: false`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ *Auto Backup DIMATIKAN!*` });
            return;
        }
        
        // INTERVAL
        if (subCommand === 'interval') {
            const interval = parseInt(args[1]);
            if (!interval || interval < 1 || interval > 168) {
                await sock.sendMessage(chat, { text: `❌ Interval harus antara 1-168 jam (1 jam - 7 hari)!` });
                return;
            }
            config.backupInterval = interval;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/backupInterval: \d+/, `backupInterval: ${interval}`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ *Interval backup diubah menjadi ${interval} jam!*\n\nRestart bot agar perubahan berlaku.` });
            return;
        }
        
        await sock.sendMessage(chat, { text: `❌ Perintah tidak dikenal! Ketik ${config.prefix}setbackup untuk bantuan.` });
    }
};