const { deletePlugin, loadPlugins } = require('../pluginHandler.js');

module.exports = {
    name: 'delplugin',
    description: 'Hapus plugin',
    ownerOnly: true,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        if (!args[0]) {
            await sock.sendMessage(chat, { text: `❌ Format: ${config.prefix}delplugin [nama_plugin]` });
            return;
        }
        
        if (deletePlugin(args[0])) {
            loadPlugins();
            await sock.sendMessage(chat, { text: `✅ Plugin ${args[0]} berhasil dihapus!` });
        } else {
            await sock.sendMessage(chat, { text: `❌ Plugin ${args[0]} tidak ditemukan!` });
        }
    }
};