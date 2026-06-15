const { setAntiChat, isAntiChatEnabled, addWhitelist, removeWhitelist, getWhitelist } = require('../lib/antiChat.js');

module.exports = {
    name: 'setantichat',
    description: 'Setting anti private chat (on/off) + whitelist',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            const whitelist = getWhitelist();
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💬 *SET ANTI PRIVATE CHAT* 💬
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Status saat ini:* ${isAntiChatEnabled() ? '🟢 ON' : '🔴 OFF'}

*Whitelist:*
${whitelist.length > 0 ? whitelist.join(', ') : '(kosong)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Perintah:*
${config.prefix}setantichat on/off
${config.prefix}setantichat add 628xxxx
${config.prefix}setantichat del 628xxxx
${config.prefix}setantichat list

━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        if (subCommand === 'on') {
            setAntiChat(true);
            await sock.sendMessage(chat, { text: `✅ *Anti Private Chat DIAKTIFKAN!*` });
            return;
        }
        
        if (subCommand === 'off') {
            setAntiChat(false);
            await sock.sendMessage(chat, { text: `✅ *Anti Private Chat DIMATIKAN!*` });
            return;
        }
        
        if (subCommand === 'add') {
            let number = args[1]?.replace(/[^0-9]/g, '');
            if (!number) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setantichat add 6281234567890` });
                return;
            }
            if (addWhitelist(number)) {
                await sock.sendMessage(chat, { text: `✅ ${number} ditambahkan ke whitelist!` });
            } else {
                await sock.sendMessage(chat, { text: `⚠️ ${number} sudah ada!` });
            }
            return;
        }
        
        if (subCommand === 'del') {
            let number = args[1]?.replace(/[^0-9]/g, '');
            if (!number) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setantichat del 6281234567890` });
                return;
            }
            if (removeWhitelist(number)) {
                await sock.sendMessage(chat, { text: `✅ ${number} dihapus dari whitelist!` });
            } else {
                await sock.sendMessage(chat, { text: `⚠️ ${number} tidak ditemukan!` });
            }
            return;
        }
        
        if (subCommand === 'list') {
            const whitelist = getWhitelist();
            await sock.sendMessage(chat, { 
                text: `📋 *WHITELIST PRIVATE CHAT*\n\n${whitelist.length > 0 ? whitelist.map((n, i) => `${i+1}. ${n}`).join('\n') : '(kosong)'}\n\nTotal: ${whitelist.length}` 
            });
            return;
        }
        
        await sock.sendMessage(chat, { text: `❌ Perintah tidak dikenal!` });
    }
};