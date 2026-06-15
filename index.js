/**
 * DooHIGH - WhatsApp Bot v2.5.0
 * Fitur: Anti Call, Anti Chat, Self/Public Mode, Fake Forward Channel Effect, Auto Backup
 * © DooOffc 17
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hairychrist/baileys-boom');
const fs = require('fs');
const path = require('path');
let config = require('./config.js');
const pluginHandler = require('./pluginHandler.js');
const sholatScheduler = require('./lib/sholat.js');
const groupHandler = require('./lib/groupHandler.js');
const antiCall = require('./lib/antiCall.js');
const antiChat = require('./lib/antiChat.js');
const modeCommand = require('./commands/setmode.js');
const backupManager = require('./lib/backupManager.js');

// Database folder
if (!fs.existsSync('./database')) fs.mkdirSync('./database');

// Load databases
let limitDB = {};
let premiumDB = {};
let listDB = {};

const dbFiles = ['limit.json', 'premium.json', 'listdata.json'];
dbFiles.forEach(file => {
    const dbPath = `./database/${file}`;
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
});
limitDB = JSON.parse(fs.readFileSync('./database/limit.json', 'utf-8'));
premiumDB = JSON.parse(fs.readFileSync('./database/premium.json', 'utf-8'));
listDB = JSON.parse(fs.readFileSync('./database/listdata.json', 'utf-8'));

// Load plugins
let plugins = pluginHandler.loadPlugins();

// Anti spam
const cooldown = new Map();

// Load owner command
const ownerCommand = require('./commands/owner.js');

let sock = null;

function reloadConfig() {
    delete require.cache[require.resolve('./config.js')];
    config = require('./config.js');
    console.log('[CONFIG] Reloaded!');
}

async function startBot() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   DooHIGH - WA BOT v2.5.0');
    console.log('   © DooOffc 17');
    console.log('   🔥 ANTI CALL + ANTI CHAT + FAKE FORWARD + AUTO BACKUP 🔥');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['DooBotz', 'Chrome', config.version]
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    // ========== ANTI CALL HANDLER ==========
    sock.ev.on('call', async (calls) => {
        if (!config.antiCall) return;
        for (const call of calls) {
            await antiCall.handleCall(sock, call, config);
        }
    });
    
    // ========== GROUP EVENT: WELCOME & GOODBYE ==========
    sock.ev.on('group-participants.update', async (update) => {
        await groupHandler.handleGroupUpdate(sock, update, config);
    });
    
    // Connection handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📱 Scan QR Code dengan WhatsApp!');
        }
        
        if (connection === 'open') {
            console.log('✅ BOT AKTIF BOS!');
            console.log(`📱 Bot Number: ${config.botNumber}`);
            console.log(`🔑 Pairing Code: ${config.pairingCode}`);
            console.log(`👑 Owner: ${config.ownerNumber}`);
            console.log(`⚙️ Mode: ${config.botMode.toUpperCase()}`);
            console.log(`📞 Anti Call: ${config.antiCall ? 'ON' : 'OFF'}`);
            console.log(`💬 Anti Chat: ${config.antiChat ? 'ON' : 'OFF'}`);
            console.log(`📨 Fake Forward: ${config.fakeForwardEnabled ? 'ON' : 'OFF'}`);
            console.log(`💾 Auto Backup: ${config.autoBackup ? 'ON' : 'OFF'} (${config.backupInterval} jam)`);
            console.log(`📦 Plugins: ${plugins.size}`);
            
            // START SHOLAT SCHEDULER
            sholatScheduler.startSholatScheduler(sock, config);
            console.log('🕌 Jadwal sholat auto notif aktif!');
            
            // START AUTO BACKUP
            backupManager.startAutoBackup(sock, config);
            console.log('💾 Auto backup system aktif!');
        }
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason === DisconnectReason.badSession) {
                console.log('Session error, hapus folder session dan coba lagi');
            } else {
                console.log('Reconnecting...');
                setTimeout(startBot, 3000);
            }
        }
    });
    
    // Pairing code auto
    setTimeout(async () => {
        try {
            const botNumber = config.botNumber.replace(/[^0-9]/g, '');
            const pairingCode = await sock.requestPairingCode(botNumber);
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   🔐 PAIRING CODE 🔐');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📱 Kode Pairing: ${pairingCode}`);
            console.log(`🔑 Atau pake kode: ${config.pairingCode}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } catch (err) {
            console.log('[!] Gagal request pairing code:', err.message);
        }
    }, 2000);
    
    // ========== MESSAGE HANDLER ==========
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const chat = msg.key.remoteJid;
        const isGroup = chat.endsWith('@g.us');
        const isPrivate = chat.endsWith('@s.whatsapp.net');
        const sender = msg.key.participant || chat;
        const text = msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || '';
        
        // Cek blacklist
        if (listDB.blacklist && listDB.blacklist.includes(sender.split('@')[0])) {
            return;
        }
        
        // ========== ANTI PRIVATE CHAT CHECK ==========
        if (isPrivate && config.antiChat) {
            const allowed = await antiChat.checkPrivateChat(sock, chat, sender, text, config);
            if (!allowed) return;
        }
        
        // ========== SELF MODE CHECK ==========
        const currentMode = modeCommand.getCurrentMode();
        const isOwner = sender.includes(config.ownerNumber) || sender === `${config.ownerNumber}@s.whatsapp.net`;
        
        if (currentMode === 'self' && !isOwner && text.startsWith(config.prefix)) {
            const allowedCommands = ['ping', 'menu', 'dash'];
            const isAllowed = allowedCommands.some(cmd => text.startsWith(config.prefix + cmd));
            
            if (!isAllowed) {
                const response = modeCommand.getModeResponse(
                    sender.split('@')[0], 
                    config.botName, 
                    config.ownerNumber
                );
                await sock.sendMessage(chat, { 
                    text: response,
                    mentions: [sender]
                });
                return;
            }
        }
        
        // AUTO DETECT OWNER & SAPA
        await ownerCommand.checkAndGreetOwner(sock, chat, sender, isGroup);
        
        // Reply dengan foto
        if (text && (text.toLowerCase().includes('halo') || text.toLowerCase().includes('hai'))) {
            await sock.sendMessage(chat, {
                image: { url: config.replyImageUrl },
                caption: `Halo juga @${sender.split('@')[0]}! Ada yang bisa ${config.botAsistant} bantu? 😊`,
                mentions: [sender]
            });
        }
        
        // Anti spam
        if (config.antiSpam) {
            if (cooldown.has(sender)) {
                if (Date.now() - cooldown.get(sender) < config.commandCooldown) {
                    return;
                }
            }
            cooldown.set(sender, Date.now());
        }
        
        // Cek premium & limit
        const isPremium = premiumDB[sender] && premiumDB[sender].expired > Date.now();
        
        // COMMAND HANDLER
        if (text.startsWith(config.prefix)) {
            const args = text.slice(config.prefix.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            
            const skipLimit = ['claim', 'topup', 'setmode', 'owner', 'dash', 'menu', 'ping', 'backup', 'setbackup'];
            if (!isOwner && !isPremium && !skipLimit.includes(commandName)) {
                const userLimit = limitDB[sender] || config.defaultLimit;
                if (userLimit <= 0) {
                    await sock.sendMessage(chat, { text: `⚠️ Limit habis! Ketik ${config.prefix}claim atau ${config.prefix}topup` });
                    return;
                }
                limitDB[sender] = (limitDB[sender] || config.defaultLimit) - 1;
                fs.writeFileSync('./database/limit.json', JSON.stringify(limitDB, null, 2));
            }
            
            if (commandName === 'setmode' || commandName === 'setbackup') {
                reloadConfig();
            }
            
            const isPlugin = plugins.has(commandName);
            if (isPlugin) {
                await pluginHandler.executePlugin(sock, commandName, args, msg, sender, isOwner, isPremium, chat, config);
                return;
            }
            
            const commandPath = path.join(__dirname, 'commands', `${commandName}.js`);
            if (fs.existsSync(commandPath)) {
                try {
                    delete require.cache[require.resolve(commandPath)];
                    const cmd = require(commandPath);
                    if (cmd.execute) {
                        await cmd.execute(sock, args, msg, sender, isOwner, isPremium, chat, config);
                    }
                } catch (err) {
                    console.log(`Error: ${err.message}`);
                }
            }
        }
    });
}

startBot();