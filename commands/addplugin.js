const { addPlugin, loadPlugins } = require('../pluginHandler.js');

module.exports = {
    name: 'addplugin',
    description: 'Tambah plugin baru dari WhatsApp',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        if (args.length < 2) {
            await sock.sendMessage(chat, { 
                text: `❌ Format: ${config.prefix}addplugin namaku module.exports = { name: 'namaku', execute: async (sock, args, msg, sender, isOwner, isPremium, chat, config) => { await sock.sendMessage(chat, { text: 'Hai' }); } };` 
            });
            return;
        }
        
        const pluginName = args[0];
        let pluginCode = args.slice(1).join(' ');
        
        if (!pluginCode.includes('module.exports')) {
            await sock.sendMessage(chat, { text: '❌ Kode plugin tidak valid!' });
            return;
        }
        
        try {
            addPlugin(pluginName, pluginCode);
            loadPlugins();
            await sock.sendMessage(chat, { text: `✅ Plugin ${pluginName} berhasil ditambah!` });
        } catch (err) {
            await sock.sendMessage(chat, { text: `❌ Error: ${err.message}` });
        }
    }
};