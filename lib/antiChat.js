const fs = require('fs');

const antiChatDBPath = './database/anti_chat.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(antiChatDBPath)) {
    fs.writeFileSync(antiChatDBPath, JSON.stringify({
        enabled: true,
        whitelist: ['6282172992548']
    }, null, 2));
}

let antiChatDB = JSON.parse(fs.readFileSync(antiChatDBPath, 'utf-8'));

function saveAntiChat() {
    fs.writeFileSync(antiChatDBPath, JSON.stringify(antiChatDB, null, 2));
}

function isAntiChatEnabled() {
    return antiChatDB.enabled;
}

function setAntiChat(enabled) {
    antiChatDB.enabled = enabled;
    saveAntiChat();
}

function addWhitelist(number) {
    if (!antiChatDB.whitelist.includes(number)) {
        antiChatDB.whitelist.push(number);
        saveAntiChat();
        return true;
    }
    return false;
}

function removeWhitelist(number) {
    const index = antiChatDB.whitelist.indexOf(number);
    if (index !== -1) {
        antiChatDB.whitelist.splice(index, 1);
        saveAntiChat();
        return true;
    }
    return false;
}

function getWhitelist() {
    return antiChatDB.whitelist;
}

function isWhitelisted(number) {
    return antiChatDB.whitelist.includes(number);
}

async function checkPrivateChat(sock, chat, sender, text, config) {
    if (!chat.endsWith('@s.whatsapp.net')) return true;
    if (!antiChatDB.enabled) return true;
    
    const senderNumber = sender.split('@')[0];
    const isOwner = senderNumber === config.ownerNumber;
    const isWhitelisted = antiChatDB.whitelist.includes(senderNumber);
    
    if (isOwner || isWhitelisted) return true;
    
    const message = config.antiChatMessage
        .replace(/@user/g, `@${senderNumber}`)
        .replace(/{userNumber}/g, senderNumber)
        .replace(/{ownerName}/g, config.ownerName)
        .replace(/{ownerNumber}/g, config.ownerNumber);
    
    await sock.sendMessage(chat, {
        text: message,
        mentions: [sender]
    });
    
    return false;
}

module.exports = {
    isAntiChatEnabled,
    setAntiChat,
    addWhitelist,
    removeWhitelist,
    getWhitelist,
    isWhitelisted,
    checkPrivateChat
};