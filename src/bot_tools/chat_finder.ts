import { Client } from 'whatsapp-web.js'

export class ChatFinder {

    static client: Client;

    static init(client: Client) {
        ChatFinder.client = client
    };

    static async findChat(chatId: string) {
        console.log(`Searching chat ${chatId}`);
        return ChatFinder.client.getChats().then(chats => {
            console.log(chats[0].id._serialized)
            return chats.find(chat => chat.id._serialized === (chatId + "@c.us"));
        });
    }
}