const qrcode = require('qrcode-terminal');
import { ClientManager } from './client_manager';
import { Client, LocalAuth, Chat, Message } from 'whatsapp-web.js'
import { MongoDB } from './db/mongo/mongo_db';

async function main() {
    console.log("Shekemishlohim Bot!");
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { args: ['--no-sandbox'] }
    });

    console.log("Client created");
    var mongoDb = new MongoDB();
    await mongoDb.init();
    console.log(`MongoDB initialized with ${await mongoDb.userCount()} users`);
    var client_manager = new ClientManager(mongoDb);

    client.on('qr', (qr: any) => {
        console.log("QR code: " + qr);
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('message', (message: Message) => {
        message.getChat().then((chat: Chat) => {
            try {
                client_manager.handleClient(chat, message);
            } catch (error) {
                console.log(error);
            }
        })
    });

    client.initialize();
}

main()