const fs = require('fs');

const welcomePath = './database/welcome.json';
const goodbyePath = './database/goodbye.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(welcomePath)) fs.writeFileSync(welcomePath, JSON.stringify({}, null, 2));
if (!fs.existsSync(goodbyePath)) fs.writeFileSync(goodbyePath, JSON.stringify({}, null, 2));

let welcomeDB = JSON.parse(fs.readFileSync(welcomePath, 'utf-8'));
let goodbyeDB = JSON.parse(fs.readFileSync(goodbyePath, 'utf-8'));

function saveWelcome() {
    fs.writeFileSync(welcomePath, JSON.stringify(welcomeDB, null, 2));
}

function saveGoodbye() {
    fs.writeFileSync(goodbyePath, JSON.stringify(goodbyeDB, null, 2));
}

function setWelcome(groupId, text, imageUrl = null) {
    welcomeDB[groupId] = { text, imageUrl, updatedAt: new Date().toISOString() };
    saveWelcome();
    return true;
}

function setGoodbye(groupId, text, imageUrl = null) {
    goodbyeDB[groupId] = { text, imageUrl, updatedAt: new Date().toISOString() };
    saveGoodbye();
    return true;
}

function getWelcome(groupId) {
    return welcomeDB[groupId] || null;
}

function getGoodbye(groupId) {
    return goodbyeDB[groupId] || null;
}

function processText(text, user, groupName, userNumber) {
    return text
        .replace(/@user/g, `@${userNumber}`)
        .replace(/@grup/g, groupName)
        .replace(/@desc/g, '')
        .replace(/@time/g, new Date().toLocaleTimeString('id-ID'))
        .replace(/@date/g, new Date().toLocaleDateString('id-ID'));
}

async function handleGroupUpdate(sock, update, config) {
    const { id, participants, action } = update;
    
    if (action === 'add') {
        for (const participant of participants) {
            const welcome = getWelcome(id);
            if (welcome) {
                const groupMeta = await sock.groupMetadata(id);
                const groupName = groupMeta.subject;
                const userNumber = participant.split('@')[0];
                const processedText = processText(welcome.text, participant, groupName, userNumber);
                
                if (welcome.imageUrl && config.welcomeWithImage) {
                    await sock.sendMessage(id, {
                        image: { url: welcome.imageUrl },
                        caption: processedText,
                        mentions: [participant]
                    });
                } else {
                    await sock.sendMessage(id, {
                        text: processedText,
                        mentions: [participant]
                    });
                }
            }
        }
    }
    
    if (action === 'remove') {
        for (const participant of participants) {
            const goodbye = getGoodbye(id);
            if (goodbye) {
                const groupMeta = await sock.groupMetadata(id);
                const groupName = groupMeta.subject;
                const userNumber = participant.split('@')[0];
                const processedText = processText(goodbye.text, participant, groupName, userNumber);
                
                if (goodbye.imageUrl && config.goodbyeWithImage) {
                    await sock.sendMessage(id, {
                        image: { url: goodbye.imageUrl },
                        caption: processedText,
                        mentions: [participant]
                    });
                } else {
                    await sock.sendMessage(id, {
                        text: processedText,
                        mentions: [participant]
                    });
                }
            }
        }
    }
}

module.exports = {
    setWelcome,
    setGoodbye,
    getWelcome,
    getGoodbye,
    handleGroupUpdate
};