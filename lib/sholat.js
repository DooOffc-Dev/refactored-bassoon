const axios = require('axios');
const fs = require('fs');

const sholatDB = './database/sholat.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(sholatDB)) {
    fs.writeFileSync(sholatDB, JSON.stringify({ lastNotif: {}, today: null }, null, 2));
}

async function getJadwalSholat(city) {
    try {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=indonesia&method=20`);
        const timings = response.data.data.timings;
        return {
            imsak: timings.Imsak,
            subuh: timings.Fajr,
            dzuhur: timings.Dhuhr,
            ashar: timings.Asr,
            maghrib: timings.Maghrib,
            isya: timings.Isha,
            date: response.data.data.date.readable
        };
    } catch (err) {
        console.log('[SHOLAT] Error fetching:', err.message);
        return null;
    }
}

function formatTimeToMinutes(time) {
    const [hour, minute] = time.split(':');
    return parseInt(hour) * 60 + parseInt(minute);
}

async function checkAndSendSholat(sock, config) {
    if (!config.sholatNotif) return;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentDate = now.toLocaleDateString('id-ID');
    
    let db = JSON.parse(fs.readFileSync(sholatDB, 'utf-8'));
    
    let jadwal = db.today;
    if (!jadwal || db.lastNotif.date !== currentDate) {
        jadwal = await getJadwalSholat(config.sholatCity);
        if (jadwal) {
            db.today = jadwal;
            db.lastNotif = { date: currentDate, sent: {} };
            fs.writeFileSync(sholatDB, JSON.stringify(db, null, 2));
        }
    }
    
    if (!jadwal) return;
    
    const sholatTimes = [
        { name: '🌅 IMSAK', time: jadwal.imsak, notifBefore: 10 },
        { name: '🕌 SUBUH', time: jadwal.subuh, notifBefore: 5 },
        { name: '🌙 DZUHUR', time: jadwal.dzuhur, notifBefore: 5 },
        { name: '☀️ ASHAR', time: jadwal.ashar, notifBefore: 5 },
        { name: '🌇 MAGHRIB', time: jadwal.maghrib, notifBefore: 5 },
        { name: '🌃 ISYA', time: jadwal.isya, notifBefore: 5 }
    ];
    
    for (const sholat of sholatTimes) {
        const sholatMinutes = formatTimeToMinutes(sholat.time);
        const diff = sholatMinutes - currentMinutes;
        
        if (diff >= 0 && diff <= sholat.notifBefore && !db.lastNotif.sent[sholat.name]) {
            const message = `━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🕌 *JADWAL SHOLAT* 🕌
━━━━━━━━━━━━━━━━━━━━━━━━━━━

${sholat.name} *${sholat.time}*
📅 ${jadwal.date}
📍 Kota: ${config.sholatCity.toUpperCase()}

"Hayya'alas Salah, Hayya'alal Falah"
Mari kita tunaikan sholat tepat waktu!

━━━━━━━━━━━━━━━━━━━━━━━━━━━
© DooBotz - DooOffc 17
━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
            
            await sock.sendMessage(config.sholatGroupId, { text: message });
            
            db.lastNotif.sent[sholat.name] = true;
            fs.writeFileSync(sholatDB, JSON.stringify(db, null, 2));
            
            console.log(`[SHOLAT] Sent notif: ${sholat.name} at ${sholat.time}`);
        }
    }
}

function startSholatScheduler(sock, config) {
    setInterval(async () => {
        await checkAndSendSholat(sock, config);
    }, 60000);
    
    console.log('[SHOLAT] Scheduler started!');
}

module.exports = { getJadwalSholat, checkAndSendSholat, startSholatScheduler };