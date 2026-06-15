const fs = require('fs');
const { createWhatsAppStatusMessage } = require('../lib/fakeForward.js');

module.exports = {
    name: 'dash',
    description: 'Dashboard ringkas bot dengan format kaya Status WhatsApp',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        let ownerDB = {};
        if (fs.existsSync('./database/owner.json')) {
            ownerDB = JSON.parse(fs.readFileSync('./database/owner.json', 'utf-8'));
        }
        const ownerNumber = ownerDB.ownerNumber || config.ownerNumber;
        
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        let limitDB = {};
        if (fs.existsSync('./database/limit.json')) {
            limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
        }
        const userLimit = limitDB[sender] || config.defaultLimit;
        
        const caption = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨ *BOT DASHBOARD* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━

┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     👋 *HALO BOSKU!*     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🤖 *Nama Bot* : ${config.botName}
📱 *Mode* : ${config.botMode === 'self' ? '🔒 SELF' : '🌐 PUBLIC'}
📞 *Anti Call* : ${config.antiCall ? '🟢 ON' : '🔴 OFF'}
💬 *Anti Chat* : ${config.antiChat ? '🟢 ON' : '🔴 OFF'}
⏱️ *Uptime* : ${hours} jam ${minutes} menit
💾 *Limit* : ${userLimit}
👑 *Owner* : ${ownerNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *QUICK MENU*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 !menu - Menu lengkap
🔹 !allmenu - Semua perintah
🔹 !owner - Info owner
🔹 !setmode - Ganti mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Ketik !menu untuk lengkap
© ${config.botName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const statusMessage = createWhatsAppStatusMessage(
            config.menuImageUrl,
            config.fakeForwardName,
            caption,
            config
        );
        
        await sock.sendMessage(chat, statusMessage);
    }
};