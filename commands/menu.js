const fs = require('fs');
const { createWhatsAppStatusMessage, createForwardedAudio } = require('../lib/fakeForward.js');

module.exports = {
    name: 'menu',
    description: 'Menampilkan menu utama dengan format kaya Status WhatsApp',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        let ownerDB = {};
        if (fs.existsSync('./database/owner.json')) {
            ownerDB = JSON.parse(fs.readFileSync('./database/owner.json', 'utf-8'));
        }
        const ownerNumber = ownerDB.ownerNumber || config.ownerNumber;
        const ownerName = ownerDB.ownerName || config.ownerName;
        
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        let limitDB = {};
        if (fs.existsSync('./database/limit.json')) {
            limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
        }
        const userLimit = limitDB[sender] || config.defaultLimit;
        
        const menuText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✨ *${config.botName.toUpperCase()}* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━

HALLO PERKENALKAN AKU ADALAH
*${config.botName}* 🤖

YANG SIAP MEMBANTUMU
DALAM MENGURUS SEGALA KEBUTUHAN, DAN TOOLS LAINNYA.

✨ *SENANG BISA MEMBANTUMU* ✨

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *STATISTIK BOT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ Uptime     : ${hours}j ${minutes}m ${seconds}d
📱 Mode       : ${config.botMode === 'self' ? '🔒 SELF' : '🌐 PUBLIC'}
📞 Anti Call  : ${config.antiCall ? '🟢 ON' : '🔴 OFF'}
💬 Anti Chat  : ${config.antiChat ? '🟢 ON' : '🔴 OFF'}
📦 Version    : ${config.version}
💾 Limit Kamu : ${userLimit}
👑 Owner      : ${ownerName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *MENU PERINTAH*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 !dash     - Dashboard
🔹 !ping     - Cek status
🔹 !owner    - Info owner
🔹 !limit    - Cek limit
🔹 !claim    - Klaim limit
🔹 !allmenu  - Semua perintah
🔹 !setwelcome - Set welcome
🔹 !setgoodbye - Set goodbye
🔹 !addlist  - Tambah list
🔹 !delist   - Hapus list
🔹 !listdata - Lihat list
🔹 !payment  - Metode bayar
🔹 !topup    - Topup limit
🔹 !listplugins - Lihat plugin
🔹 !addplugin - Tambah plugin
🔹 !setmode  - Ganti mode
🔹 !setanticall - Anti call
🔹 !setantichat - Anti chat
🔹 !setforward - Efek channel

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *TIPS & TRICK*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Ketik !allmenu untuk semua perintah
📌 Ketik !owner teks untuk ganti sapa owner

━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${config.botName} - ${ownerName}
📱 wa.me/${ownerNumber}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const statusMessage = createWhatsAppStatusMessage(
            config.menuImageUrl,
            config.fakeForwardName,
            menuText,
            config
        );
        
        await sock.sendMessage(chat, statusMessage);
        
        if (config.menuAudioUrl && config.menuAudioUrl !== 'https://files.catbox.moe/xxxxx.mp3') {
            const audioMessage = createForwardedAudio(config.menuAudioUrl, config);
            await sock.sendMessage(chat, audioMessage);
        }
    }
};