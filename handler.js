const fs = require('fs');
const path = require('path');

function loadCommands() {
    const commands = new Map();
    const commandsPath = path.join(__dirname, 'commands');
    
    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);
    
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
        try {
            delete require.cache[require.resolve(`./commands/${file}`)];
            const cmd = require(`./commands/${file}`);
            if (cmd.name) {
                commands.set(cmd.name, cmd);
                console.log(`[CMD] Loaded: ${cmd.name}`);
            }
        } catch (err) {
            console.log(`[CMD] Error: ${file} - ${err.message}`);
        }
    }
    
    return commands;
}

module.exports = { loadCommands };