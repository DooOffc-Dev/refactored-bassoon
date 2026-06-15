const fs = require('fs');

const dbPath = './database/owner.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({
        ownerNumber: '6282172992548',
        ownerName: 'DooOffc 17',
        sapaText: '👑 @owner ANJAYYYY BOSQUE GUA UDAH ON! 🔥',
        lastGreeted: {}
    }, null, 2));
}

let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

function saveDb() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

async function checkAndGreetOwner(sock, chat, sender, isGroup) {
    if (!isGroup) return false;
    if (!sender.includes(db.ownerNumber)) return false;
    
    const now = Date.now();
    const lastGreet = db.lastGreeted?.[`${chat}_${sender}`] || 0;
    if (now - lastGreet < 5 * 60 * 1000) return false;
    
    if (!db.lastGreeted) db.lastGreeted = {};
    db.lastGreeted[`${chat}_${sender}`] = now;
    saveDb();
    
    const sapaMessage = db.sapaText.replace(/@owner/g, `@${sender.split('@')[0]}`);
    await sock.sendMessage(chat, {
        text: sapaMessage,
        mentions: [sender]
    });
    
    return true;
}

module.exports = {
    name: 'owner',
    description: 'Lihat & ganti teks sapa owner',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const sub = args[0]?.toLowerCase();
        
        if (!sub) {
            await sock.sendMessage(chat, { 
                text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   👑 *OWNER BOT* 👑
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Nomor Owner:* ${db.ownerNumber}
📛 *Nama Owner:* ${db.ownerName}
📝 *Teks Sapa Saat Ini:*
"${db.sapaText}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Perintah:*
• ${config.prefix}owner ganti 628xxxx - Ganti nomor owner
• ${config.prefix}owner nama [nama] - Ganti nama owner
• ${config.prefix}owner teks [kata] - Ganti teks sapa

*Contoh ganti teks:*
${config.prefix}owner teks 👑 @owner WOY BOS QUE UDAH ON!

━━━━━━━━━━━━━━━━━━━━━━━━━━━` 
            });
            return;
        }
        
        if (sub === 'ganti') {
            if (!isOwner) {
                await sock.sendMessage(chat, { text: '❌ Lu bukan owner, gabisa!' });
                return;
            }
            const newNumber = args[1]?.replace(/[^0-9]/g, '');
            if (!newNumber) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}owner ganti 6281234567890` });
                return;
            }
            db.ownerNumber = newNumber;
            saveDb();
            await sock.sendMessage(chat, { text: `✅ Nomor owner diganti: ${newNumber}` });
            return;
        }
        
        if (sub === 'nama') {
            if (!isOwner) {
                await sock.sendMessage(chat, { text: '❌ Lu bukan owner, gabisa!' });
                return;
            }
            const newName = args.slice(1).join(' ');
            if (!newName) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}owner nama [Nama Owner]` });
                return;
            }
            db.ownerName = newName;
            saveDb();
            await sock.sendMessage(chat, { text: `✅ Nama owner diganti: ${newName}` });
            return;
        }
        
        if (sub === 'teks') {
            if (!isOwner) {
                await sock.sendMessage(chat, { text: '❌ Lu bukan owner, gabisa ganti teks!' });
                return;
            }
            const newText = args.slice(1).join(' ');
            if (!newText) {
                await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}owner teks [kata sapaan mu]` });
                return;
            }
            db.sapaText = newText;
            saveDb();
            await sock.sendMessage(chat, { text: `✅ Teks sapa berhasil diganti!\n\nSekarang jadi:\n"${newText}"` });
            return;
        }
        
        await sock.sendMessage(chat, { text: `❌ Gak kenal! Ketik ${config.prefix}owner aja.` });
    }
};

module.exports.checkAndGreetOwner = checkAndGreetOwner;