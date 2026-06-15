module.exports = {
    name: 'ping',
    description: 'Cek status bot',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        await sock.sendMessage(chat, { text: '🏓 Pong! Bot aktif bos!' });
    }
};