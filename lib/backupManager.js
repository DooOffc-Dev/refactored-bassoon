/**
 * DooHIGH - Backup Manager
 * Auto backup script dan kirim ke owner
 * © DooOffc 17
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Fungsi backup semua file
async function createBackup(config) {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup_${config.botName}_${timestamp}.zip`;
        const backupPath = path.join(__dirname, '../', backupName);
        
        const output = fs.createWriteStream(backupPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', () => {
            console.log(`[BACKUP] Created: ${backupName} (${archive.pointer()} bytes)`);
            resolve(backupPath);
        });
        
        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        
        // Backup setiap file/folder yang di config
        for (const item of config.backupFiles) {
            const itemPath = path.join(__dirname, '../', item);
            if (fs.existsSync(itemPath)) {
                const stat = fs.statSync(itemPath);
                if (stat.isDirectory()) {
                    archive.directory(itemPath, item);
                } else {
                    archive.file(itemPath, { name: item });
                }
            }
        }
        
        archive.finalize();
    });
}

// Kirim backup ke owner
async function sendBackup(sock, config) {
    try {
        const backupPath = await createBackup(config);
        const backupBuffer = fs.readFileSync(backupPath);
        const backupName = path.basename(backupPath);
        
        const ownerJid = `${config.ownerNumber}@s.whatsapp.net`;
        
        const caption = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💾 *AUTO BACKUP REPORT* 💾
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Bot:* ${config.botName}
📦 *Version:* ${config.version}
⏱️ *Time:* ${new Date().toLocaleString('id-ID')}
📁 *File:* ${backupName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Isi Backup:*
${config.backupFiles.map(f => `• ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Backup otomatis setiap ${config.backupInterval} jam
━━━━━━━━━━━━━━━━━━━━━━━━━━━
© ${config.botName} - DooOffc 17
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        await sock.sendMessage(ownerJid, {
            document: backupBuffer,
            mimetype: 'application/zip',
            fileName: backupName,
            caption: caption
        });
        
        // Hapus file backup setelah terkirim
        fs.unlinkSync(backupPath);
        console.log(`[BACKUP] Sent to owner & deleted local file`);
        
        return true;
    } catch (err) {
        console.log(`[BACKUP] Error: ${err.message}`);
        return false;
    }
}

// Manual backup (panggil dari command)
async function manualBackup(sock, config, chat) {
    try {
        const backupPath = await createBackup(config);
        const backupBuffer = fs.readFileSync(backupPath);
        const backupName = path.basename(backupPath);
        
        const caption = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   💾 *MANUAL BACKUP* 💾
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Bot:* ${config.botName}
📦 *Version:* ${config.version}
⏱️ *Time:* ${new Date().toLocaleString('id-ID')}
📁 *File:* ${backupName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Backup berhasil dibuat!
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        
        await sock.sendMessage(chat, {
            document: backupBuffer,
            mimetype: 'application/zip',
            fileName: backupName,
            caption: caption
        });
        
        fs.unlinkSync(backupPath);
        return true;
    } catch (err) {
        await sock.sendMessage(chat, { text: `❌ Backup gagal: ${err.message}` });
        return false;
    }
}

// Start auto backup scheduler
function startAutoBackup(sock, config) {
    if (!config.autoBackup) {
        console.log('[BACKUP] Auto backup is OFF');
        return;
    }
    
    const intervalMs = config.backupInterval * 60 * 60 * 1000;
    
    // Backup pertama kali setelah 5 menit bot jalan
    setTimeout(async () => {
        console.log('[BACKUP] Running first auto backup...');
        await sendBackup(sock, config);
    }, 5 * 60 * 1000);
    
    // Backup berkala
    setInterval(async () => {
        console.log(`[BACKUP] Running scheduled backup (every ${config.backupInterval} hours)...`);
        await sendBackup(sock, config);
    }, intervalMs);
    
    console.log(`[BACKUP] Auto backup started! Interval: ${config.backupInterval} hours`);
}

module.exports = { createBackup, sendBackup, manualBackup, startAutoBackup };