const fs = require('fs');

module.exports = {
    name: 'setforward',
    description: 'Setting fake forward/channel effect (kaya Status WhatsApp)',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📨 *SET FAKE FORWARD / CHANNEL* 📨
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Status:* ${config.fakeForwardEnabled ? '🟢 ON' : '🔴 OFF'}
*Nama Channel:* ${config.fakeForwardName}
*Tipe:* ${config.fakeForwardType}
*Centang Biru:* ${config.showBlueCheck ? '✅ ON' : '❌ OFF'}
*WhatsApp Meta:* ${config.showWhatsAppMeta ? '✅ ON' : '❌ OFF'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Tampilan pesan akan seperti:*

📱 *Diteruskan*
*${config.fakeForwardName}*

WhatsApp ✓✓ · Status

[FOTO]

[ISI PESAN]

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Perintah:*

${config.prefix}setforward on/off
${config.prefix}setforward name [nama]
${config.prefix}setforward type [status/channel/meta]
${config.prefix}setforward check on/off
${config.prefix}setforward meta on/off

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Contoh:*
${config.prefix}setforward name AL STORY
${config.prefix}setforward check on

━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        if (subCommand === 'on') {
            config.fakeForwardEnabled = true;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/fakeForwardEnabled: (true|false)/, `fakeForwardEnabled: true`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ *Fake Forward DIAKTIFKAN!*` });
            return;
        }
        
        if (subCommand === 'off') {
            config.fakeForwardEnabled = false;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/fakeForwardEnabled: (true|false)/, `fakeForwardEnabled: false`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ *Fake Forward DIMATIKAN!*` });
            return;
        }
        
        if (subCommand === 'name') {
            const newName = args.slice(1).join(' ');
            if (!newName) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setforward name [nama channel]` });
                return;
            }
            config.fakeForwardName = newName;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/fakeForwardName: '.*'/, `fakeForwardName: '${newName.replace(/'/g, "\\'")}'`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ Nama channel: *${newName}*` });
            return;
        }
        
        if (subCommand === 'type') {
            const newType = args[1]?.toLowerCase();
            if (!newType || !['status', 'channel', 'meta', 'business'].includes(newType)) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setforward type [status/channel/meta/business]` });
                return;
            }
            config.fakeForwardType = newType;
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/fakeForwardType: '.*'/, `fakeForwardType: '${newType}'`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ Tipe: *${newType}*` });
            return;
        }
        
        if (subCommand === 'check') {
            const status = args[1]?.toLowerCase();
            if (!status || (status !== 'on' && status !== 'off')) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setforward check on/off` });
                return;
            }
            config.showBlueCheck = status === 'on';
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/showBlueCheck: (true|false)/, `showBlueCheck: ${status === 'on'}`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ Centang biru ${status === 'on' ? 'DIAKTIFKAN' : 'DIMATIKAN'}!` });
            return;
        }
        
        if (subCommand === 'meta') {
            const status = args[1]?.toLowerCase();
            if (!status || (status !== 'on' && status !== 'off')) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setforward meta on/off` });
                return;
            }
            config.showWhatsAppMeta = status === 'on';
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/showWhatsAppMeta: (true|false)/, `showWhatsAppMeta: ${status === 'on'}`);
            fs.writeFileSync(configPath, configContent);
            await sock.sendMessage(chat, { text: `✅ WhatsApp metadata ${status === 'on' ? 'DIAKTIFKAN' : 'DIMATIKAN'}!` });
            return;
        }
        
        await sock.sendMessage(chat, { text: `❌ Perintah tidak dikenal!` });
    }
};