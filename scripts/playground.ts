const qrcode = require('qrcode-terminal');
import { Client, LocalAuth, Chat, Message, Contact } from 'whatsapp-web.js'
import { MongoDB } from '../src/db/mongo/mongo_db';

async function main() {
    var mongoDb = new MongoDB();
    await mongoDb.init();
    console.log(`MongoDB initialized with ${await mongoDb.userCount()} users`);

    console.log("Shekemishlohim Bot!");
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { args: ['--no-sandbox'] }
    });

    client.on('qr', (qr: any) => {
        console.log("QR code: " + qr);
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        client.getChats().then((chats: Chat[]) => {
            chats.forEach((chat: Chat) => {
                chat.getContact().then((contact: Contact) => {
                    mongoDb.getUser(contact.number).then((user: any) => {}).catch((error: any) => {
                        console.log(contact.number);
                    });
                    
                });
            });
        });
    });

    client.on('message', (message: Message) => { });

    client.initialize();
}

main()