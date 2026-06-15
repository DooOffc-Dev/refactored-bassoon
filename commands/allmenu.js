const fs = require('fs');
const path = require('path');
const { createWhatsAppStatusMessage } = require('../lib/fakeForward.js');

module.exports = {
    name: 'allmenu',
    description: 'Menampilkan semua perintah dengan format kaya Status WhatsApp',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        let ownerDB = {};
        if (fs.existsSync('./database/owner.json')) {
            ownerDB = JSON.parse(fs.readFileSync('./database/owner.json', 'utf-8'));
        }
        const ownerNumber = ownerDB.ownerNumber || config.ownerNumber;
        
        // Load semua command dari folder commands/
        const commandsPath = path.join(__dirname, './');
        let allCommands = [];
        
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js') && f !== 'allmenu.js');
        for (const file of files) {
            try {
                const cmd = require(`./${file}`);
                if (cmd.name && cmd.description) {
                    allCommands.push({ name: cmd.name, desc: cmd.description });
                }
            } catch (err) {
                console.log(`Error loading ${file}:`, err.message);
            }
        }
        
        // Load semua plugin
        try {
            const pluginHandler = require('../pluginHandler.js');
            const plugins = pluginHandler.getAllPlugins();
            for (const plugin of plugins) {
                allCommands.push({ name: plugin.name, desc: plugin.description || 'Plugin custom' });
            }
        } catch (err) {
            console.log('Error loading plugins:', err.message);
        }
        
        // Urutkan berdasarkan nama
        allCommands.sort((a, b) => a.name.localeCompare(b.name));
        
        // Buat teks menu
        let menuText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📋 *ALL MENU COMMANDS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *TOTAL ${allCommands.length} PERINTAH* ✨

━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        let no = 1;
        for (const cmd of allCommands) {
            menuText += `${no}. *${config.prefix}${cmd.name}* - ${cmd.desc}\n`;
            no++;
        }
        
        menuText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Ketik *${config.prefix}menu* untuk menu utama
💡 Ketik *${config.prefix}dash* untuk dashboard

© ${config.botName} - DooOffc 17
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        // Kirim dengan format fake forward
        const statusMessage = createWhatsAppStatusMessage(
            config.menuImageUrl,
            config.fakeForwardName,
            menuText,
            config
        );
        
        await sock.sendMessage(chat, statusMessage);
    }
};