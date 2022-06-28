const qrcode = require('qrcode-terminal');
import { ClientManager } from './client_manager';
import { Client, LocalAuth, Chat, Message} from 'whatsapp-web.js'

function main() {
    console.log("Shekemishlohim Bot!");
    const client = new Client({
        authStrategy: new LocalAuth()
    });
    
    var client_manager = new ClientManager();

    client.on('qr', (qr: any) => {
        qrcode.generate(qr, {small: true});
    });
    
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    client.on('message', (message: Message) => {
        message.getChat().then((chat: Chat) => {
            client_manager.handleClient(chat, message);
        })
        // message.reply('Hello!');
    });
    
    client.initialize();
}

main()