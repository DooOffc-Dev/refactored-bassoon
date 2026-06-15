const fs = require('fs');

const blockedCallPath = './database/blocked_call.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(blockedCallPath)) {
    fs.writeFileSync(blockedCallPath, JSON.stringify([], null, 2));
}

let blockedCallDB = JSON.parse(fs.readFileSync(blockedCallPath, 'utf-8'));

function saveBlockedCall() {
    fs.writeFileSync(blockedCallPath, JSON.stringify(blockedCallDB, null, 2));
}

function addBlockedCall(number) {
    if (!blockedCallDB.includes(number)) {
        blockedCallDB.push(number);
        saveBlockedCall();
        return true;
    }
    return false;
}

function isBlockedCall(number) {
    return blockedCallDB.includes(number);
}

async function handleCall(sock, callData, config) {
    const caller = callData.from;
    const callerNumber = caller.split('@')[0];
    const isOwner = caller.includes(config.ownerNumber);
    
    if (isOwner) {
        console.log(`[ANTI CALL] Owner call, diabaikan`);
        return;
    }
    
    console.log(`[ANTI CALL] Call detected from: ${callerNumber}`);
    
    const message = config.antiCallMessage
        .replace(/@user/g, `@${callerNumber}`)
        .replace(/{userNumber}/g, callerNumber)
        .replace(/{ownerName}/g, config.ownerName)
        .replace(/{ownerNumber}/g, config.ownerNumber);
    
    try {
        await sock.sendMessage(caller, {
            text: message,
            mentions: [caller]
        });
    } catch (err) {
        console.log(`[ANTI CALL] Gagal kirim pesan: ${err.message}`);
    }
    
    try {
        await sock.updateBlockStatus(caller, 'block');
        addBlockedCall(callerNumber);
        console.log(`[ANTI CALL] Blocked: ${callerNumber}`);
    } catch (err) {
        console.log(`[ANTI CALL] Gagal block: ${err.message}`);
    }
}

module.exports = { handleCall, isBlockedCall, addBlockedCall };
