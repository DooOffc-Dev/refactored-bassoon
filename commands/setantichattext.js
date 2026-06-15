const fs = require('fs');

module.exports = {
    name: 'setantichattext',
    description: 'Ganti teks pesan anti private chat',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const newText = args.join(' ');
        
        if (!newText) {
            await sock.sendMessage(chat, { 
                text: `❌ Format: ${config.prefix}setantichattext [pesanmu]\n\nTeks saat ini:\n${config.antiChatMessage}` 
            });
            return;
        }
        
        config.antiChatMessage = newText;
        const configPath = './config.js';
        let configContent = fs.readFileSync(configPath, 'utf-8');
        configContent = configContent.replace(/antiChatMessage: '.*'/, `antiChatMessage: '${newText.replace(/'/g, "\\'")}'`);
        fs.writeFileSync(configPath, configContent);
        
        await sock.sendMessage(chat, { text: `✅ Teks anti chat berhasil diganti!` });
    }
};