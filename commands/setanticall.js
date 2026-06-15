const fs = require('fs');

module.exports = {
    name: 'setanticall',
    description: 'Setting anti call (on/off)',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const status = args[0]?.toLowerCase();
        
        if (!status || (status !== 'on' && status !== 'off')) {
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📞 *SET ANTI CALL* 📞
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Status saat ini:* ${config.antiCall ? '🟢 ON' : '🔴 OFF'}

*Format:*
${config.prefix}setanticall on - Aktifkan anti call
${config.prefix}setanticall off - Matikan anti call

━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        config.antiCall = status === 'on';
        const configPath = './config.js';
        let configContent = fs.readFileSync(configPath, 'utf-8');
        configContent = configContent.replace(/antiCall: (true|false)/, `antiCall: ${status === 'on'}`);
        fs.writeFileSync(configPath, configContent);
        
        await sock.sendMessage(chat, { 
            text: `✅ *Anti Call ${status === 'on' ? 'DIAKTIFKAN' : 'DIMATIKAN'}!*` 
        });
    }
};