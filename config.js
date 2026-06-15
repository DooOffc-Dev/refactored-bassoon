/**
 * DooHIGH - WhatsApp Bot Configuration v2.5.0
 * © DooOffc 17
 */

module.exports = {
    // Basic
    prefix: '.',
    botName: 'ASD·BOTZ',
    botNumber: '6282172992548',
    botAsistant: 'ASD·BOTZ ASISTANT',
    version: '2.5.0',
    
    // Bot Mode
    botMode: 'public',
    
    // Owner
    ownerNumber: '6282172992548',
    ownerName: 'DooOffc 17',
    ownerJid: '6282172992548@s.whatsapp.net',
    
    // ========== AUTO BACKUP SETTINGS ==========
    autoBackup: true,                    // true = auto backup on, false = off
    backupInterval: 6,                   // Backup setiap berapa jam? (6 jam sekali)
    backupFiles: [                       // File/folder yang akan di backup
        'index.js',
        'config.js',
        'handler.js',
        'pluginHandler.js',
        'commands',
        'lib',
        'plugins'
    ],
    backupExclude: [                    // File/folder yang di EXCLUDE (tidak di backup)
        'session',
        'database',
        'node_modules',
        'package-lock.json'
    ],
    
    // ========== FAKE FORWARD / CHANNEL EFFECT ==========
    fakeForwardEnabled: true,
    fakeForwardName: 'AL STORY',
    fakeForwardId: '120363365432109876',
    fakeForwardType: 'status',
    showBlueCheck: true,
    showWhatsAppMeta: true,
    
    // ========== ANTI CALL & ANTI CHAT ==========
    antiCall: true,
    antiCallMessage: '🚫 *ANTI CALL DETECTED!*\n\nMaaf @user, kamu diblokir otomatis karena melakukan panggilan suara/video ke bot.\n\n📞 Nomor: {userNumber}\n👑 Owner: {ownerName}\n📱 Hubungi owner: wa.me/{ownerNumber}',
    
    antiChat: true,
    antiChatMessage: '🚫 *PRIVATE CHAT OFF!*\n\nMaaf @user, saat ini bot sedang dalam mode *PRIVATE CHAT OFF*.\n\n👑 Hanya *OWNER* yang bisa chat privat dengan bot.\n\n📱 Hubungi owner: wa.me/{ownerNumber}',
    
    chatWhitelist: ['6282172992548'],
    
    // URL Menu
    menuImageUrl: 'https://img2.pixhost.to/images/7829/725106182_asd-botz.jpg',
    menuAudioUrl: '',
    replyImageUrl: 'https://img2.pixhost.to/images/7829/725106182_asd-botz.jpg',
    
    // Pairing Code
    pairingCode: 'DOOhttps://img2.pixhost.to/images/7829/725106182_asd-botz.jpg',
    autoPair: true,
    
    // Limit & Premium
    defaultLimit: 20,
    premiumUnlimited: true,
    
    // Anti Spam
    antiSpam: true,
    commandCooldown: 2000,
    
    // Welcome/Goodbye
    defaultWelcome: '👋 Halo @user, selamat datang di grup @grup!',
    defaultGoodbye: '👋 Selamat tinggal @user, sampai jumpa lagi!',
    welcomeWithImage: true,
    goodbyeWithImage: true,
    
    // Payment Settings
    paymentMethods: {
        qris: 'https://files.catbox.moe/qris.jpg',
        dana: '085123456789',
        ovo: '085123456789',
        gopay: '085123456789'
    },
    topupPrice: 10000,
    topupLimit: 100,
    
    // Jadwal Sholat
    sholatCity: 'jakarta',
    sholatNotif: true,
    sholatGroupId: 'grup_id_anda@g.us',
    
    // List Types
    listTypes: ['blacklist', 'whitelist', 'admin', 'premium'],
    
    // Database
    dbPath: './database/'
};