const { getAllPlugins } = require('../pluginHandler.js');

module.exports = {
    name: 'listplugins',
    description: 'Lihat semua plugin',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        const plugins = getAllPlugins();
        
        if (plugins.length === 0) {
            await sock.sendMessage(chat, { text: '📦 Belum ada plugin!' });
            return;
        }
        
        let text = `📦 *PLUGINS (${plugins.length})*\n\n`;
        plugins.forEach(p => {
            text += `🔹 *${p.name}* - ${p.description || 'No desc'}\n`;
        });
        
        await sock.sendMessage(chat, { text });
    }
};