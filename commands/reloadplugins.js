const { loadPlugins } = require('../pluginHandler.js');

module.exports = {
    name: 'reloadplugins',
    description: 'Reload semua plugin',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const plugins = loadPlugins();
        await sock.sendMessage(chat, { text: `✅ ${plugins.size} plugin berhasil direload!` });
    }
};