const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

const badWords = ['mjinga', 'malaya', 'fuck', 'shit', 'bitch', 'idiot', 'kuma', 'tombwa'];

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot iko tayari!');
});

client.on('message', async (msg) => {
    try {
        const chat = await msg.getChat();
        if (!chat.isGroup) return;

        const text = msg.body.toLowerCase();

        if (text === '!ping') {
            msg.reply('Pong! Bot iko hai');
            return;
        }

        const hasBad = badWords.some(w => text.includes(w));
        if (hasBad) {
            await msg.delete(true);
            await chat.sendMessage(`@${msg.author.split('@')[0]} Tafadhali heshimu group, usitusi!`, { mentions: [msg.author] });
        }
    } catch (e) {
        console.log(e);
    }
});

client.initialize()
