module.exports = {
    name: 'halo',
    description: 'Plugin sapa user',
    version: '1.0.0',
    author: 'DooOffc 17',
    ownerOnly: false,
    
    async execute(sock, args, msg, sender, isOwner, isPremium, chat, config) {
        await sock.sendMessage(chat, { text: `Halo bos! Selamat datang di DooHIGH Bot!` });
    }
};
