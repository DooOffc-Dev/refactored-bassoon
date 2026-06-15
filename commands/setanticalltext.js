const fs = require('fs');

module.exports = {
    name: 'setanticalltext',
    description: 'Ganti teks pesan anti call',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const newText = args.join(' ');
        
        if (!newText) {
            await sock.sendMessage(chat, { 
                text: `❌ Format: ${config.prefix}setanticalltext [pesanmu]\n\nTeks saat ini:\n${config.antiCallMessage}\n\nPlaceholder:\n@user, {userNumber}, {ownerName}, {ownerNumber}` 
            });
            return;
        }
        
        config.antiCallMessage = newText;
        const configPath = './config.js';
        let configContent = fs.readFileSync(configPath, 'utf-8');
        configContent = configContent.replace(/antiCallMessage: '.*'/, `antiCallMessage: '${newText.replace(/'/g, "\\'")}'`);
        fs.writeFileSync(configPath, configContent);
        
        await sock.sendMessage(chat, { text: `✅ Teks anti call berhasil diganti!` });
    }
};