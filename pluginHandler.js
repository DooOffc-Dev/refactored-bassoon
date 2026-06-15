const fs = require('fs');
const path = require('path');

const pluginsPath = path.join(__dirname, 'plugins');
let plugins = new Map();

if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath);
if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync('./database/plugins.json')) {
    fs.writeFileSync('./database/plugins.json', JSON.stringify({}, null, 2));
}

function loadPlugins() {
    plugins.clear();
    
    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
        try {
            delete require.cache[require.resolve(`./plugins/${file}`)];
            const plugin = require(`./plugins/${file}`);
            if (plugin.name && plugin.execute) {
                plugins.set(plugin.name, plugin);
                console.log(`[PLUGIN] Loaded: ${plugin.name}`);
            }
        } catch (err) {
            console.log(`[PLUGIN] Error: ${file} - ${err.message}`);
        }
    }
    
    return plugins;
}

function addPlugin(pluginName, code) {
    const pluginPath = path.join(pluginsPath, `${pluginName}.js`);
    fs.writeFileSync(pluginPath, code);
    return true;
}

function deletePlugin(pluginName) {
    const pluginPath = path.join(pluginsPath, `${pluginName}.js`);
    if (fs.existsSync(pluginPath)) {
        fs.unlinkSync(pluginPath);
        return true;
    }
    return false;
}

function getAllPlugins() {
    return Array.from(plugins.values());
}

async function executePlugin(sock, pluginName, args, msg, sender, isOwner, isPremium, chat, config) {
    const plugin = plugins.get(pluginName);
    if (!plugin) return false;
    
    if (plugin.ownerOnly && !isOwner) {
        await sock.sendMessage(chat, { text: '❌ Plugin ini khusus owner!' });
        return true;
    }
    
    try {
        await plugin.execute(sock, args, msg, sender, isOwner, isPremium, chat, config);
        return true;
    } catch (err) {
        await sock.sendMessage(chat, { text: `❌ Plugin error: ${err.message}` });
        return true;
    }
}

module.exports = { loadPlugins, addPlugin, deletePlugin, getAllPlugins, executePlugin, plugins };