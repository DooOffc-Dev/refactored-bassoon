const fs = require('fs');

const modeDBPath = './database/mode.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(modeDBPath)) {
    fs.writeFileSync(modeDBPath, JSON.stringify({
        mode: 'public',
        selfText: '🔒 *SELF MODE ACTIVE*\n\nMaaf @user, bot ini sedang dalam mode *SELF*.\nHanya *OWNER* yang bisa menggunakan bot ini.\n\n📱 Hubungi owner: wa.me/{ownerNumber}\n\n© {botName}',
        publicText: '🌐 *PUBLIC MODE ACTIVE*\n\nHalo @user! Selamat datang di *{botName}* 🤖\n\nSilakan ketik *!menu* untuk melihat perintah yang tersedia.\n\n📌 Gunakan dengan bijak ya bos!\n\n© {botName}'
    }, null, 2));
}

let modeDB = JSON.parse(fs.readFileSync(modeDBPath, 'utf-8'));

function saveModeDB() {
    fs.writeFileSync(modeDBPath, JSON.stringify(modeDB, null, 2));
}

function getModeResponse(user, botName, ownerNumber) {
    const text = modeDB.mode === 'self' ? modeDB.selfText : modeDB.publicText;
    return text
        .replace(/@user/g, `@${user}`)
        .replace(/{botName}/g, botName)
        .replace(/{ownerNumber}/g, ownerNumber);
}

function getCurrentMode() {
    return modeDB.mode;
}

module.exports = {
    name: 'setmode',
    description: 'Set mode bot (self/public) dan teksnya',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ⚙️ *SET MODE BOT* ⚙️
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Mode saat ini:* ${modeDB.mode === 'self' ? '🔒 SELF MODE' : '🌐 PUBLIC MODE'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Perintah:*

1️⃣ *Ganti Mode:*
   ${config.prefix}setmode self
   ${config.prefix}setmode public

2️⃣ *Ganti Teks Mode SELF:*
   ${config.prefix}setmode selfteks [pesanmu]

3️⃣ *Ganti Teks Mode PUBLIC:*
   ${config.prefix}setmode publicteks [pesanmu]

4️⃣ *Lihat Teks Mode SELF:*
   ${config.prefix}setmode viewself

5️⃣ *Lihat Teks Mode PUBLIC:*
   ${config.prefix}setmode viewpublic

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Placeholder:*
@user - Nama user
{botName} - Nama bot
{ownerNumber} - Nomor owner

━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        if (subCommand === 'self') {
            modeDB.mode = 'self';
            saveModeDB();
            
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/botMode: '.*'/, `botMode: 'self'`);
            fs.writeFileSync(configPath, configContent);
            
            await sock.sendMessage(chat, { text: `✅ *Mode berhasil diubah ke SELF MODE!*` });
            return;
        }
        
        if (subCommand === 'public') {
            modeDB.mode = 'public';
            saveModeDB();
            
            const configPath = './config.js';
            let configContent = fs.readFileSync(configPath, 'utf-8');
            configContent = configContent.replace(/botMode: '.*'/, `botMode: 'public'`);
            fs.writeFileSync(configPath, configContent);
            
            await sock.sendMessage(chat, { text: `✅ *Mode berhasil diubah ke PUBLIC MODE!*` });
            return;
        }
        
        if (subCommand === 'selfteks') {
            const newText = args.slice(1).join(' ');
            if (!newText) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setmode selfteks [pesanmu]\n\nTeks saat ini:\n${modeDB.selfText}` });
                return;
            }
            modeDB.selfText = newText;
            saveModeDB();
            await sock.sendMessage(chat, { text: `✅ Teks Self Mode berhasil diganti!` });
            return;
        }
        
        if (subCommand === 'publicteks') {
            const newText = args.slice(1).join(' ');
            if (!newText) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}setmode publicteks [pesanmu]\n\nTeks saat ini:\n${modeDB.publicText}` });
                return;
            }
            modeDB.publicText = newText;
            saveModeDB();
            await sock.sendMessage(chat, { text: `✅ Teks Public Mode berhasil diganti!` });
            return;
        }
        
        if (subCommand === 'viewself') {
            await sock.sendMessage(chat, { text: `📝 *Teks Self Mode:*\n\n${modeDB.selfText}` });
            return;
        }
        
        if (subCommand === 'viewpublic') {
            await sock.sendMessage(chat, { text: `📝 *Teks Public Mode:*\n\n${modeDB.publicText}` });
            return;
        }
        
        await sock.sendMessage(chat, { text: `❌ Perintah tidak dikenal!` });
    }
};

module.exports.getModeResponse = getModeResponse;
module.exports.getCurrentMode = getCurrentMode;